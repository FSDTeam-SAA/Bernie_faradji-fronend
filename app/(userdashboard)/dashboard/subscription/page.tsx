"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";
import SubscriptionPageSkeleton from "../../_components/SubscriptionPageSkeleton";

type SubscriptionStatus = "Active" | "Expired" | "Cancelled";

interface MembershipPlan {
  planName?: string;
  price?: number;
  billingCycle?: string;
}

interface MembershipData {
  _id: string;
  planId?: MembershipPlan | null;
  startDate?: string;
  status?: string;
}

interface MembershipApiResponse {
  success: boolean;
  message: string;
  data?: MembershipData | null;
}

interface SessionWithFallbackToken {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

interface SubscriptionRow {
  id: string;
  planName: string;
  price: string;
  date: string;
  status: SubscriptionStatus;
}

const ITEMS_PER_PAGE = 5;

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatDate = (dateString?: string): string => {
  if (!dateString) return "--";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleDateString("en-GB");
};

const getStatus = (status?: string): SubscriptionStatus => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "EXPIRED":
      return "Expired";
    default:
      return "Cancelled";
  }
};

const getBadgeVariant = (status: SubscriptionStatus) => {
  switch (status) {
    case "Active":
      return "secondary";
    case "Expired":
      return "destructive";
    case "Cancelled":
      return "outline";
    default:
      return "default";
  }
};

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }
  return apiBaseUrl.replace(/\/+$/, "");
};

const readApiErrorMessage = async (response: Response): Promise<string> => {
  const data = await response.json().catch(() => null);
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }
  return "Something went wrong while fetching subscription data.";
};

const fetchMembership = async (token: string): Promise<MembershipApiResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/memberships/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  return response.json();
};

export default function SubscriptionPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;
  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["my-membership", accessToken],
    queryFn: () => fetchMembership(accessToken as string),
    enabled: canFetch,
  });

  const subscriptions = useMemo<SubscriptionRow[]>(() => {
    const membership = data?.data;
    if (!membership?._id) return [];

    const planName = membership.planId?.planName ?? "Unknown Plan";
    const billingCycle = membership.planId?.billingCycle?.trim();

    return [
      {
        id: membership._id,
        planName: billingCycle ? `${planName} (${billingCycle})` : planName,
        price: gbpFormatter.format(membership.planId?.price ?? 0),
        date: formatDate(membership.startDate),
        status: getStatus(membership.status),
      },
    ];
  }, [data]);

  const totalPages = Math.max(Math.ceil(subscriptions.length / ITEMS_PER_PAGE), 1);
  const activePage = Math.min(currentPage, totalPages);
  const paginatedSubscriptions = subscriptions.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  if (sessionStatus === "loading" || isLoading) {
    return <SubscriptionPageSkeleton />;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to see your subscription data.
      </div>
    );
  }

  if (sessionStatus === "authenticated" && !accessToken) {
    return (
      <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Login session found, but access token is missing. Please log out and log in
        again.
      </div>
    );
  }

  return (
    <div className="w-full montserrat">
      <h1 className="mb-6 text-2xl font-bold">Subscription</h1>

      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Subscription Details</h2>
          {isFetching && (
            <span className="text-xs text-slate-500 sm:text-sm">Updating...</span>
          )}
        </div>

        <p className="mb-2 text-xs text-slate-500 sm:hidden">
          Swipe left/right to see full table.
        </p>

        {isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.message || "Failed to load subscription data."}
          </div>
        )}

        <Table className="min-w-[640px] rounded-lg bg-white shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center text-xs sm:text-sm">Plan Name</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Price</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Date</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-sm font-normal text-[#222222] sm:text-base">
            {paginatedSubscriptions.length > 0 ? (
              paginatedSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="py-4 text-center font-bold">
                    {subscription.planName}
                  </TableCell>
                  <TableCell className="py-4 text-center">{subscription.price}</TableCell>
                  <TableCell className="py-4 text-center">{subscription.date}</TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge
                      variant={getBadgeVariant(subscription.status)}
                      className="rounded-full px-3 py-1 text-sm"
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-6 text-center text-slate-500" colSpan={4}>
                  No subscription data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 self-end">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

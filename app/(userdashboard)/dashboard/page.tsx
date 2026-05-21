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
import DashboardPageSkeleton from "../_components/DashboardPageSkeleton";

type ActivityStatus = "Cleared" | "Pending";

interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalTokens: number;
    totalJourneys: number;
  };
}

interface JourneyCategory {
  name?: string;
}

interface Journey {
  _id: string;
  categoryId?: JourneyCategory | null;
  preferredDate?: string;
  totalPrice?: number;
  journeyStatus?: string;
}

interface RecentJourneysResponse {
  success: boolean;
  message: string;
  meta?: {
    totalPages?: number;
  };
  data: {
    journeys: Journey[];
    paginationInfo?: {
      totalPages?: number;
    };
  };
}

interface Activity {
  id: string;
  type: string;
  date: string;
  amount: string;
  status: ActivityStatus;
}

type SessionWithFallbackToken = {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
};

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

const getStatus = (status?: string): ActivityStatus =>
  status?.toUpperCase() === "CLEARED" ? "Cleared" : "Pending";



const readApiErrorMessage = async (response: Response): Promise<string> => {
  const data = await response.json().catch(() => null);
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }
  return "Something went wrong while fetching dashboard data.";
};

const fetchDashboardStats = async (token: string): Promise<DashboardStatsResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-dashboard/stats`, {
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

const fetchRecentJourneys = async (
  token: string,
  page: number,
): Promise<RecentJourneysResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(ITEMS_PER_PAGE),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/journeys/my-journeys?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  return response.json();
};

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;
  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    isError: hasStatsError,
    error: statsError,
  } = useQuery({
    queryKey: ["user-dashboard-stats", accessToken],
    queryFn: () => fetchDashboardStats(accessToken as string),
    enabled: canFetch,
  });

  const {
    data: journeysResponse,
    isLoading: isJourneysLoading,
    isError: hasJourneysError,
    error: journeysError,
    isFetching: isJourneysFetching,
  } = useQuery({
    queryKey: ["user-dashboard-recent-journeys", accessToken, currentPage],
    queryFn: () => fetchRecentJourneys(accessToken as string, currentPage),
    enabled: canFetch,
  });

  const activities = useMemo<Activity[]>(() => {
    const journeys = journeysResponse?.data?.journeys ?? [];
    return journeys.map((journey) => ({
      id: journey._id,
      type: journey.categoryId?.name ?? "Journey Charge",
      date: formatDate(journey.preferredDate),
      amount: gbpFormatter.format(journey.totalPrice ?? 0),
      status: getStatus(journey.journeyStatus),
    }));
  }, [journeysResponse]);

  const totalPages = useMemo(() => {
    const pageCountFromPaginationInfo =
      journeysResponse?.data?.paginationInfo?.totalPages;
    const pageCountFromMeta = journeysResponse?.meta?.totalPages;
    return Math.max(pageCountFromPaginationInfo ?? pageCountFromMeta ?? 1, 1);
  }, [journeysResponse]);

  const activePage = Math.min(currentPage, totalPages);

  if (sessionStatus === "loading" || isStatsLoading || isJourneysLoading) {
    return <DashboardPageSkeleton/>;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to see dashboard stats and recent activity.
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
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg bg-[#002A5D] p-4 text-white sm:p-6">
          <div>
            <p className="text-sm">Total Tokens</p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {statsResponse?.data?.totalTokens ?? 0}
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-blue-900 sm:h-12 sm:w-12">
            £
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#004EAF] p-4 text-white sm:p-6">
          <div>
            <p className="text-sm">Total Journeys Taken</p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {statsResponse?.data?.totalJourneys ?? 0}
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-blue-600 sm:h-12 sm:w-12">
            🚗
          </div>
        </div>
      </div>

      {(hasStatsError || hasJourneysError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {statsError?.message ||
            journeysError?.message ||
            "Failed to load dashboard data."}
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold sm:text-xl">Recent Activity</h3>
          {isJourneysFetching && (
            <span className="text-xs text-slate-500 sm:text-sm">Updating...</span>
          )}
        </div>

        <Table className="rounded-lg bg-white shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Charge Type</TableHead>
              <TableHead className="text-xs sm:text-sm">Date</TableHead>
              <TableHead className="text-xs sm:text-sm">Total Amount</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm font-normal text-[#222222] sm:text-base">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="py-4 font-bold">{activity.type}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.amount}</TableCell>
                  <TableCell>
                    <Badge
                      className="h-[32px] rounded-[18px] px-3 sm:h-[36px]"
                      variant={
                        activity.status === "Cleared" ? "default" : "destructive"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-6 text-center text-slate-500" colSpan={4}>
                  No recent activity found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

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
import { Eye } from "lucide-react";
import { JourneyDetailsModal } from "./_components/JourneyDetailsModal";
import JourneyPlanPageSkeleton from "../../_components/JourneyPlanPageSkeleton";

type JourneyStatus = "Cleared" | "Pending";

interface JourneyCategory {
  name?: string;
}

interface JourneyApiItem {
  _id: string;
  categoryId?: JourneyCategory | null;
  preferredDate?: string;
  createdAt?: string;
  totalPrice?: number;
  journeyStatus?: string;
  vehicleNumber?: string;
}

interface JourneyApiResponse {
  success: boolean;
  message: string;
  meta?: {
    totalPages?: number;
  };
  data: {
    journeys: JourneyApiItem[];
    paginationInfo?: {
      totalPages?: number;
    };
  };
}

interface SessionWithFallbackToken {
  accessToken?: string;
  user?: {
    accessToken?: string;
    name?: string;
    email?: string;
  };
}

interface JourneyRow {
  id: string;
  type: string;
  purchaseDate: string;
  journeyDate: string;
  totalAmount: string;
  status: JourneyStatus;
  modalData: {
    name: string;
    email: string;
    vehicleNumber: string;
    journeyName: string;
    totalAmount: string;
    purchaseDate: string;
    journeyDate: string;
  };
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

const getStatus = (status?: string): JourneyStatus =>
  status?.toUpperCase() === "CLEARED" ? "Cleared" : "Pending";

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
  return "Something went wrong while fetching journeys.";
};

const fetchMyJourneys = async (token: string, page: number): Promise<JourneyApiResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(ITEMS_PER_PAGE),
  });

  const response = await fetch(
    `${getApiBaseUrl()}/journeys/my-journeys?${queryParams.toString()}`,
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

export default function JourneyPlan() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<JourneyRow["modalData"] | null>(null);

  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;
  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const {
    data: journeyResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["dashboard-my-journeys", accessToken, currentPage],
    queryFn: () => fetchMyJourneys(accessToken as string, currentPage),
    enabled: canFetch,
  });

  const userName = session?.user?.name?.trim() || "--";
  const userEmail = session?.user?.email?.trim() || "--";

  const journeyRows = useMemo<JourneyRow[]>(() => {
    const journeys = journeyResponse?.data?.journeys ?? [];

    return journeys.map((journey) => {
      const purchaseDate = formatDate(journey.createdAt);
      const journeyDate = formatDate(journey.preferredDate);
      const totalAmount = gbpFormatter.format(journey.totalPrice ?? 0);

      return {
        id: journey._id,
        type: journey.categoryId?.name ?? "Journey Charge",
        purchaseDate,
        journeyDate,
        totalAmount,
        status: getStatus(journey.journeyStatus),
        modalData: {
          name: userName,
          email: userEmail,
          vehicleNumber: journey.vehicleNumber ?? "--",
          journeyName: journey.categoryId?.name ?? "Journey Charge",
          totalAmount,
          purchaseDate,
          journeyDate,
        },
      };
    });
  }, [journeyResponse, userEmail, userName]);

  const totalPages = useMemo(() => {
    const pageCountFromPaginationInfo =
      journeyResponse?.data?.paginationInfo?.totalPages;
    const pageCountFromMeta = journeyResponse?.meta?.totalPages;
    return Math.max(pageCountFromPaginationInfo ?? pageCountFromMeta ?? 1, 1);
  }, [journeyResponse]);

  const activePage = Math.min(currentPage, totalPages);

  const handleOpenModal = (journey: JourneyRow) => {
    setSelectedJourney(journey.modalData);
    setIsOpen(true);
  };

  if (sessionStatus === "loading" || isLoading) {
    return <JourneyPlanPageSkeleton />;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to see your journey plan.
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
      <h3 className="mb-4 text-xl font-semibold">Journey Plan</h3>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-lg font-medium">Journey Plan Details</h4>
          {isFetching && (
            <span className="text-xs text-slate-500 sm:text-sm">Updating...</span>
          )}
        </div>

        <p className="mb-2 text-xs text-slate-500 sm:hidden">
          Swipe left/right to see full table.
        </p>

        {isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.message || "Failed to load journey data."}
          </div>
        )}

        <Table className="min-w-[860px] rounded-lg bg-white shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center text-xs sm:text-sm">
                Charge Type
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Purchase Date
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Journey Date
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Total Amount
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm font-normal text-[#222222] sm:text-base">
            {journeyRows.length > 0 ? (
              journeyRows.map((journey) => (
                <TableRow key={journey.id} className="text-center">
                  <TableCell className="py-4 text-center font-bold">
                    {journey.type}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {journey.purchaseDate}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {journey.journeyDate}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {journey.totalAmount}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge
                      variant={journey.status === "Cleared" ? "default" : "secondary"}
                      className="rounded-full px-3 py-1 text-sm"
                    >
                      {journey.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <button
                      onClick={() => handleOpenModal(journey)}
                      className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-6 text-center text-slate-500" colSpan={6}>
                  No journey data found.
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

      {selectedJourney && (
        <JourneyDetailsModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedJourney(null);
          }}
          data={selectedJourney}
        />
      )}
    </div>
  );
}

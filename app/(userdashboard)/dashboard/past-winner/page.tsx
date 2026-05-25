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
import PastWinnerPageSkeleton from "../../_components/PastWinnerPageSkeleton";

interface WinnerHistoryUser {
  name?: string;
  email?: string;
}

interface WinnerHistoryPrize {
  prizeTag?: string;
}

interface WinnerHistoryToken {
  vehicleNumber?: string;
}

interface WinnerHistoryItem {
  _id: string;
  userId?: WinnerHistoryUser | null;
  prizeId?: WinnerHistoryPrize | null;
  tokenId?: WinnerHistoryToken | null;
  vehicleNumber?: string;
  selectionType?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface WinnerHistoryResponse {
  success: boolean;
  message: string;
  meta?: {
    totalPages?: number;
  };
  data?: {
    winners?: WinnerHistoryItem[];
    paginationInfo?: {
      totalPages?: number;
    };
  };
}

interface SessionWithFallbackToken {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

interface WinnerRow {
  id: string;
  name: string;
  email: string;
  prize: string;
  vehicleNumber: string;
  selectionType: string;
  wonDate: string;
  status: "Active" | "Inactive";
}

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString?: string): string => {
  if (!dateString) return "--";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleDateString("en-GB");
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
  return "Something went wrong while fetching past winners.";
};

const fetchWinnerHistory = async (
  token: string,
  page: number,
): Promise<WinnerHistoryResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(ITEMS_PER_PAGE),
  });

  const response = await fetch(
    `${getApiBaseUrl()}/tokens/winner/history?${queryParams.toString()}`,
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

const getBadgeVariant = (status: WinnerRow["status"]) => {
  return status === "Active" ? "secondary" : "outline";
};

export default function PastWinnerPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;
  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["winner-history", accessToken, currentPage],
    queryFn: () => fetchWinnerHistory(accessToken as string, currentPage),
    enabled: canFetch,
  });

  const winnerRows = useMemo<WinnerRow[]>(() => {
    const winners = data?.data?.winners ?? [];
    return winners.map((winner) => ({
      id: winner._id,
      name: winner.userId?.name?.trim() || "--",
      email: winner.userId?.email?.trim() || "--",
      prize: winner.prizeId?.prizeTag?.trim() || "Not assigned",
      vehicleNumber:
        winner.vehicleNumber?.trim() || winner.tokenId?.vehicleNumber?.trim() || "--",
      selectionType: winner.selectionType?.toUpperCase() || "--",
      wonDate: formatDate(winner.createdAt),
      status: winner.isActive ? "Active" : "Inactive",
    }));
  }, [data]);

  const totalPages = useMemo(() => {
    const pageCountFromPaginationInfo = data?.data?.paginationInfo?.totalPages;
    const pageCountFromMeta = data?.meta?.totalPages;
    return Math.max(pageCountFromPaginationInfo ?? pageCountFromMeta ?? 1, 1);
  }, [data]);

  const activePage = Math.min(currentPage, totalPages);

  if (sessionStatus === "loading" || isLoading) {
    return <PastWinnerPageSkeleton />;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to see past winner details.
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
      <h1 className="mb-6 text-2xl font-bold">Past Winner</h1>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold sm:text-xl">Winner History</h3>
          {isFetching && (
            <span className="text-xs text-slate-500 sm:text-sm">Updating...</span>
          )}
        </div>
        <p className="mb-2 text-xs text-slate-500 sm:hidden">
          Swipe left/right to see full table.
        </p>

        {isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.message || "Failed to load winner history."}
          </div>
        )}

        <Table className="min-w-[1120px] rounded-lg bg-white shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center text-xs sm:text-sm">Winner Name</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Email</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Prize</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Vehicle Number
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Selection Type
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Won Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-sm font-normal text-[#222222] sm:text-base">
            {winnerRows.length > 0 ? (
              winnerRows.map((winner) => (
                <TableRow key={winner.id}>
                  <TableCell className="py-4 text-center font-bold">{winner.name}</TableCell>
                  <TableCell className="text-center">{winner.email}</TableCell>
                  <TableCell className="text-center">{winner.prize}</TableCell>
                  <TableCell className="text-center">{winner.vehicleNumber}</TableCell>
                  <TableCell className="text-center">{winner.selectionType}</TableCell>
                  <TableCell className="text-center">{winner.wonDate}</TableCell>
                 
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-6 text-center text-slate-500" colSpan={7}>
                  No winner history found.
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


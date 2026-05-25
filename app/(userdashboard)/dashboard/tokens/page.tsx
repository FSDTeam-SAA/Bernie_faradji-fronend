"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";
import TokensPageSkeleton from "../../_components/TokensPageSkeleton";
import { TokenDetailsModal, type TokenDetailsData } from "./_components/TokenDetailsModal";

interface WinnerUser {
  name?: string;
  email?: string;
}

interface WinnerPrize {
  prizeTag?: string;
}

interface Winner {
  userId?: WinnerUser | null;
  prizeId?: WinnerPrize | null;
  vehicleNumber?: string;
}

interface CurrentWinnerResponse {
  success: boolean;
  message: string;
  data?: Winner | null;
}

interface TokenItem {
  _id: string;
  tokenPrice?: number;
  totalPrice?: number;
  quantity?: number;
  createdAt?: string;
  vehicleNumber?: string;
  ticketCodes?: string[];
}

interface MyTokensResponse {
  success: boolean;
  message: string;
  meta?: {
    totalPages?: number;
  };
  data: {
    winner?: Winner | null;
    tokens: TokenItem[];
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

interface TokenTableRow {
  id: string;
  token: string;
  quantity: number;
  amount: string;
  date: string;
  vehicle: string;
  modalData: TokenDetailsData;
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

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "--";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "--";

  const date = parsedDate.toLocaleDateString("en-GB");
  const time = parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date}, ${time}`;
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
  return "Something went wrong while fetching token data.";
};

const fetchCurrentWinner = async (token: string): Promise<CurrentWinnerResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/tokens/winner/current`, {
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

const fetchMyTokens = async (token: string, page: number): Promise<MyTokensResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(ITEMS_PER_PAGE),
  });

  const response = await fetch(
    `${getApiBaseUrl()}/tokens/my-tokens?${queryParams.toString()}`,
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

export default function TokensPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenDetailsData | null>(null);

  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;

  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const {
    data: winnerResponse,
    isLoading: isWinnerLoading,
    isError: hasWinnerError,
    error: winnerError,
  } = useQuery({
    queryKey: ["current-winner", accessToken],
    queryFn: () => fetchCurrentWinner(accessToken as string),
    enabled: canFetch,
  });

  const {
    data: myTokensResponse,
    isLoading: isTokensLoading,
    isError: hasTokensError,
    error: tokensError,
    isFetching: isTokensFetching,
  } = useQuery({
    queryKey: ["my-tokens", accessToken, currentPage],
    queryFn: () => fetchMyTokens(accessToken as string, currentPage),
    enabled: canFetch,
  });

  const tokenRows = useMemo<TokenTableRow[]>(() => {
    const tokens = myTokensResponse?.data?.tokens ?? [];
    return tokens.map((token) => ({
      id: token._id,
      token: gbpFormatter.format(token.tokenPrice ?? 0),
      quantity: token.quantity ?? token.ticketCodes?.length ?? 0,
      amount: gbpFormatter.format(token.totalPrice ?? 0),
      date: formatDate(token.createdAt),
      vehicle: token.vehicleNumber ?? "--",
      modalData: {
        tokenId: token._id,
        vehicleNumber: token.vehicleNumber ?? "--",
        quantity: token.quantity ?? token.ticketCodes?.length ?? 0,
        tokenPrice: gbpFormatter.format(token.tokenPrice ?? 0),
        totalAmount: gbpFormatter.format(token.totalPrice ?? 0),
        purchaseDateTime: formatDateTime(token.createdAt),
        ticketCodes: token.ticketCodes ?? [],
      },
    }));
  }, [myTokensResponse]);

  const totalPages = useMemo(() => {
    const pageCountFromPaginationInfo =
      myTokensResponse?.data?.paginationInfo?.totalPages;
    const pageCountFromMeta = myTokensResponse?.meta?.totalPages;
    return Math.max(pageCountFromPaginationInfo ?? pageCountFromMeta ?? 1, 1);
  }, [myTokensResponse]);

  const activePage = Math.min(currentPage, totalPages);

  const handleOpenModal = (token: TokenTableRow) => {
    setSelectedToken(token.modalData);
    setIsDetailsOpen(true);
  };

  const winnerData = winnerResponse?.data ?? myTokensResponse?.data?.winner;
  const winnerName = winnerData?.userId?.name?.trim();
  const winnerPrize = winnerData?.prizeId?.prizeTag?.trim();
  const winnerVehicle = winnerData?.vehicleNumber?.trim();
  const winnerText =
    winnerName && winnerVehicle
      ? `${winnerName} (${winnerVehicle})`
      : winnerName || winnerVehicle || "Not Selected Yet!";

  if (sessionStatus === "loading" || isWinnerLoading || isTokensLoading) {
    return <TokensPageSkeleton />;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to see winner and token details.
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
      <div className="mb-8">
        <h3 className="mb-2 text-xl font-semibold">Tokens</h3>
        <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow sm:p-6">
          <div className="w-full rounded-lg bg-gray-400 px-4 py-8 text-center text-white sm:max-w-sm sm:py-10">
            <p className="text-sm">Winner</p>
            <h4 className="mt-2 text-base font-medium break-words sm:text-lg">
              {winnerText}
            </h4>
            {winnerPrize && (
              <p className="mt-2 text-xs text-white/90 sm:text-sm">{winnerPrize}</p>
            )}
          </div>
        </div>
      </div>

      {(hasWinnerError || hasTokensError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {winnerError?.message ||
            tokensError?.message ||
            "Failed to load token page data."}
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold sm:text-xl">Token Details</h3>
          {isTokensFetching && (
            <span className="text-xs text-slate-500 sm:text-sm">Updating...</span>
          )}
        </div>
        <p className="mb-2 text-xs text-slate-500 sm:hidden">
          Swipe left/right to see full table.
        </p>

        <Table className="min-w-[900px] rounded-lg bg-white shadow">
          <TableHeader className="bg-[#E0EEFF]">
            <TableRow>
              <TableHead className="text-center text-xs sm:text-sm">Token per Price</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Token Quantity
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Total Amount
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Date</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">
                Vehicle Registration Number
              </TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-sm font-normal text-[#222222] sm:text-base">
            {tokenRows.length > 0 ? (
              tokenRows.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="py-4 text-center font-bold">
                    {token.token}
                  </TableCell>
                  <TableCell className="text-center">{token.quantity}</TableCell>
                  <TableCell className="text-center">{token.amount}</TableCell>
                  <TableCell className="text-center">{token.date}</TableCell>
                  <TableCell className="text-center">{token.vehicle}</TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(token)}
                      className="cursor-pointer rounded-md p-2 text-[#033D86] hover:bg-[#E0EEFF]"
                      aria-label={`View details for token ${token.id}`}
                    >
                      <Eye size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-6 text-center text-slate-500" colSpan={6}>
                  No token data found.
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

      <TokenDetailsModal
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedToken(null);
        }}
        data={selectedToken}
      />
    </div>
  );
}

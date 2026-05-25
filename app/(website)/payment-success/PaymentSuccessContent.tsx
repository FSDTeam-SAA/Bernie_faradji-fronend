"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import PaymentStatusTemplate, { PaymentDetailField } from "@/components/common/PaymentStatusTemplate";

interface SessionWithFallbackToken {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

interface JourneyApiItem {
  _id: string;
  categoryId?: {
    name?: string;
  } | null;
  preferredDate?: string;
  createdAt?: string;
  totalPrice?: number;
  journeyStatus?: string;
  vehicleNumber?: string;
}

interface JourneyApiResponse {
  data?: {
    journeys?: JourneyApiItem[];
  };
}

interface TokenItem {
  _id: string;
  totalPrice?: number;
  createdAt?: string;
  vehicleNumber?: string;
}

interface MyTokensResponse {
  data?: {
    tokens?: TokenItem[];
  };
}

interface MembershipData {
  _id: string;
  planId?: {
    planName?: string;
    price?: number;
    billingCycle?: string;
  } | null;
  startDate?: string;
  status?: string;
  createdAt?: string;
}

interface MembershipApiResponse {
  data?: MembershipData | null;
}

interface PaymentSummary {
  referenceId: string;
  purchaseType: string;
  amount: string;
  date: string;
  status: string;
  extraLabel: string;
  extraValue: string;
  timestamp: number;
}

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTimestamp = (dateString?: string) => {
  if (!dateString) return 0;

  const parsedDate = new Date(dateString);
  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
};

const getApiBaseUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  return apiBaseUrl.replace(/\/+$/, "");
};

const readApiErrorMessage = async (response: Response) => {
  const data = await response.json().catch(() => null);
  return data?.message || "Failed to load payment details.";
};

const fetchJson = async <T,>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, {
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

const fetchLatestPaymentSummary = async (token: string): Promise<PaymentSummary | null> => {
  const apiBaseUrl = getApiBaseUrl();
  const queryParams = new URLSearchParams({ page: "1", limit: "1" });

  const [journeyResult, tokenResult, membershipResult] = await Promise.allSettled([
    fetchJson<JourneyApiResponse>(`${apiBaseUrl}/journeys/my-journeys?${queryParams.toString()}`, token),
    fetchJson<MyTokensResponse>(`${apiBaseUrl}/tokens/my-tokens?${queryParams.toString()}`, token),
    fetchJson<MembershipApiResponse>(`${apiBaseUrl}/memberships/my`, token),
  ]);

  const summaries: PaymentSummary[] = [];

  if (journeyResult.status === "fulfilled") {
    const journey = journeyResult.value.data?.journeys?.[0];
    if (journey?._id) {
      const date = journey.createdAt || journey.preferredDate;

      summaries.push({
        referenceId: journey._id,
        purchaseType: journey.categoryId?.name || "Journey Plan",
        amount: gbpFormatter.format(journey.totalPrice ?? 0),
        date: formatDate(date),
        status: journey.journeyStatus || "Cleared",
        extraLabel: "Vehicle",
        extraValue: journey.vehicleNumber || "N/A",
        timestamp: getTimestamp(date),
      });
    }
  }

  if (tokenResult.status === "fulfilled") {
    const tokenData = tokenResult.value.data?.tokens?.[0];
    if (tokenData?._id) {
      summaries.push({
        referenceId: tokenData._id,
        purchaseType: "Lottery Token",
        amount: gbpFormatter.format(tokenData.totalPrice ?? 0),
        date: formatDate(tokenData.createdAt),
        status: "Confirmed",
        extraLabel: "Vehicle",
        extraValue: tokenData.vehicleNumber || "N/A",
        timestamp: getTimestamp(tokenData.createdAt),
      });
    }
  }

  if (membershipResult.status === "fulfilled") {
    const membership = membershipResult.value.data;
    if (membership?._id) {
      const planName = membership.planId?.planName || "Subscription";
      const billingCycle = membership.planId?.billingCycle?.trim();
      const date = membership.createdAt || membership.startDate;

      summaries.push({
        referenceId: membership._id,
        purchaseType: billingCycle ? `${planName} (${billingCycle})` : planName,
        amount: gbpFormatter.format(membership.planId?.price ?? 0),
        date: formatDate(date),
        status: membership.status || "Active",
        extraLabel: "Start Date",
        extraValue: formatDate(membership.startDate),
        timestamp: getTimestamp(date),
      });
    }
  }

  return summaries.sort((first, second) => second.timestamp - first.timestamp)[0] || null;
};

const buildDetailFields = (summary?: PaymentSummary | null): PaymentDetailField[] => [
  {
    label: "Amount",
    keys: ["amount", "total_amount", "store_amount", "total"],
    type: "amount",
    icon: "amount",
    fallback: summary?.amount || "Loading...",
  },
  {
    label: "Payment Date",
    keys: ["tran_date", "date", "createdAt"],
    type: "date",
    icon: "date",
    fallback: summary?.date || "Loading...",
  },
  {
    label: "Status",
    keys: ["status", "paymentStatus"],
    icon: "status",
    fallback: summary?.status || "Loading...",
  },
];

export default function PaymentSuccessContent() {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;
  const canFetch = sessionStatus === "authenticated" && !!accessToken;

  const { data: paymentSummary, isError, isLoading } = useQuery({
    queryKey: ["payment-success-latest-summary", accessToken],
    queryFn: () => fetchLatestPaymentSummary(accessToken as string),
    enabled: canFetch,
    retry: 2,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const detailFields = useMemo(() => {
    if (sessionStatus === "unauthenticated") {
      return buildDetailFields({
        referenceId: "Login required",
        purchaseType: "Login required",
        amount: "Login required",
        date: "Login required",
        status: "Login required",
        extraLabel: "Details",
        extraValue: "Login required",
        timestamp: 0,
      });
    }

    if (!canFetch || isLoading) {
      return buildDetailFields(null);
    }

    if (isError || !paymentSummary) {
      return buildDetailFields({
        referenceId: "No recent payment found",
        purchaseType: "No recent payment found",
        amount: "No recent payment found",
        date: "No recent payment found",
        status: "No recent payment found",
        extraLabel: "Details",
        extraValue: "No recent payment found",
        timestamp: 0,
      });
    }

    return buildDetailFields(paymentSummary);
  }, [canFetch, isError, isLoading, paymentSummary, sessionStatus]);

  return (
    <PaymentStatusTemplate
      status="success"
      badge="Payment Confirmed"
      title="Payment Successful"
      description="Your payment has been processed successfully. Your latest payment details are shown below."
      primaryAction={{ href: "/dashboard", label: "Go To Dashboard" }}
      secondaryAction={{ href: "/", label: "Back To Home" }}
      detailFields={detailFields}
      checklist={[
        "You should receive a confirmation email or receipt shortly.",
        "Your purchase details are available in your dashboard.",
        "Need help? Our support team is ready to assist you.",
      ]}
    />
  );
}

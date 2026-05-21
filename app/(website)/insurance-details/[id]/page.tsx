"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  PoundSterling,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface InsuranceDetails {
  _id: string;
  name?: string;
  shortDetails?: string;
  rate?: number;
  savingUpTo?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface InsuranceDetailsApiResponse {
  success: boolean;
  message?: string;
  data?: InsuranceDetails | null;
}

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
};

const readApiErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  const data = await response.json().catch(() => null);

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
};

const fetchInsuranceDetails = async (id: string): Promise<InsuranceDetails> => {
  const response = await fetch(`${getApiBaseUrl()}/insurances/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readApiErrorMessage(response, "Failed to fetch insurance details."),
    );
  }

  const data: InsuranceDetailsApiResponse = await response.json();

  if (!data.data?._id) {
    throw new Error(data.message || "Insurance details were not found.");
  }

  return data.data;
};

const formatDate = (date?: string): string => {
  if (!date) return "--";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (isActive?: boolean): string => {
  if (isActive === true) return "Active";
  if (isActive === false) return "Inactive";
  return "Status unavailable";
};

const getStatusDescription = (isActive?: boolean): string => {
  if (isActive === true) {
    return "This insurance plan is active and available for members.";
  }

  if (isActive === false) {
    return "This insurance plan is currently inactive.";
  }

  return "Availability status is not available for this plan.";
};

const InsuranceDetailsSkeleton = () => (
  <section className="bg-[#ECEEF2] py-14 sm:py-16 md:py-20 lg:py-32">
    <div className="mx-auto w-full max-w-[1080px] px-5 sm:px-8 md:px-12 lg:px-16">
      <div className="mb-8 h-11 w-36 animate-pulse rounded-md bg-[#DCE6F3]" />

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="animate-pulse bg-[#F8FBFF] p-6 sm:p-8 md:p-10">
          <div className="h-8 w-32 rounded-full bg-[#E5F0FF]" />
          <div className="mt-6 h-12 w-full max-w-[620px] rounded bg-[#DCE6F3]" />
          <div className="mt-4 h-5 w-full max-w-[780px] rounded bg-[#E8EEF7]" />
          <div className="mt-3 h-5 w-full max-w-[600px] rounded bg-[#E8EEF7]" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E1E8F2] bg-white p-5"
              >
                <div className="size-10 rounded-full bg-[#E5F0FF]" />
                <div className="mt-4 h-4 w-24 rounded bg-[#E8EEF7]" />
                <div className="mt-3 h-7 w-28 rounded bg-[#DCE6F3]" />
              </div>
            ))}
          </div>
        </div>

        <div className="animate-pulse p-6 sm:p-8 md:p-10">
          <div className="h-8 w-44 rounded bg-[#DCE6F3]" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E1E8F2] bg-[#FBFDFF] p-5"
              >
                <div className="h-5 w-40 rounded bg-[#DCE6F3]" />
                <div className="mt-3 h-4 w-full rounded bg-[#E8EEF7]" />
                <div className="mt-2 h-4 w-10/12 rounded bg-[#E8EEF7]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DetailsMessage = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <section className="bg-[#ECEEF2] py-14 sm:py-16 md:py-20 lg:py-32">
    <div className="mx-auto w-full max-w-[780px] px-5 sm:px-8">
      <Link
        href="/insurance"
        className="montserrat inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-[#004EB0] shadow-sm transition hover:bg-[#F8FBFF]"
      >
        <ArrowLeft size={18} />
        Back to Insurance
      </Link>

      <div className="mt-8 rounded-xl border border-red-100 bg-white p-6 text-center shadow-lg sm:p-8">
        <CircleAlert className="mx-auto text-red-500" size={42} />
        <h1 className="mt-4 text-3xl font-normal text-[#353535]">{title}</h1>
        <p className="montserrat mt-3 text-base leading-relaxed text-[#5A5A5A]">
          {message}
        </p>
      </div>
    </div>
  </section>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-[#E1E8F2] bg-white p-5 shadow-sm">
    <div className="flex size-11 items-center justify-center rounded-full bg-[#E5F0FF] text-[#004EB0]">
      <Icon size={21} />
    </div>
    <p className="montserrat mt-4 text-sm font-medium text-[#6A6A6A]">{label}</p>
    <p className="mt-2 text-2xl font-normal text-[#353535]">{value}</p>
  </div>
);

export default function InsuranceDetailsPage() {
  const params = useParams<{ id?: string | string[] }>();
  const insuranceId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: insurance,
    isLoading,
    isError,
    error,
  } = useQuery<InsuranceDetails, Error>({
    queryKey: ["insurance-details", insuranceId],
    queryFn: () => fetchInsuranceDetails(insuranceId as string),
    enabled: Boolean(insuranceId),
  });

  const infoRows = useMemo(
    () => [
      {
        icon: CheckCircle2,
        title: "Plan Status",
        description: getStatusDescription(insurance?.isActive),
      },
      {
        icon: BadgePercent,
        title: "Savings",
        description:
          typeof insurance?.savingUpTo === "number"
            ? `Members can save up to ${insurance.savingUpTo}% with this plan.`
            : "Savings information is not available for this plan.",
      },
      {
        icon: CalendarDays,
        title: "Created",
        description: formatDate(insurance?.createdAt),
      },
      {
        icon: Clock3,
        title: "Last Updated",
        description: formatDate(insurance?.updatedAt),
      },
    ],
    [insurance],
  );

  if (!insuranceId) {
    return (
      <DetailsMessage
        title="Insurance ID Missing"
        message="We could not find an insurance id in this page URL."
      />
    );
  }

  if (isLoading) {
    return <InsuranceDetailsSkeleton />;
  }

  if (isError || !insurance) {
    return (
      <DetailsMessage
        title="Insurance Not Found"
        message={error?.message || "Failed to load insurance details."}
      />
    );
  }

  return (
    <section className="bg-[#ECEEF2] py-14 sm:py-16 md:py-20 lg:py-32">
      <div className="mx-auto w-full max-w-[1080px] px-5 sm:px-8 md:px-12 lg:px-16">
        <Link
          href="/insurance"
          className="montserrat inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-[#004EB0] shadow-sm transition hover:bg-[#F8FBFF]"
        >
          <ArrowLeft size={18} />
          Back to Insurance
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8 overflow-hidden rounded-xl bg-white shadow-lg"
        >
          <div className="bg-[#F8FBFF] p-6 sm:p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="montserrat inline-flex items-center gap-2 rounded-full bg-[#E5F0FF] px-4 py-2 text-sm font-medium text-[#004EB0]">
                <ShieldCheck size={17} />
                Insurance Details
              </span>
              <span
                className={`montserrat rounded-full px-4 py-2 text-sm font-medium ${
                  insurance.isActive === true
                    ? "bg-emerald-50 text-emerald-700"
                    : insurance.isActive === false
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                {getStatusLabel(insurance.isActive)}
              </span>
            </div>

            <h1 className="mt-6 text-[38px] leading-[1.08] font-normal text-[#353535] sm:text-[48px] md:text-[54px]">
              {insurance.name || "Insurance Plan"}
            </h1>

            <p className="montserrat mt-4 max-w-[780px] text-base leading-relaxed text-[#4E4E4E] sm:text-lg">
              {insurance.shortDetails ||
                "No short details are available for this insurance plan."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={PoundSterling}
                label="Member Rate"
                value={`${gbpFormatter.format(insurance.rate ?? 0)}/mo`}
              />
              <StatCard
                icon={BadgePercent}
                label="Save Up To"
                value={
                  typeof insurance.savingUpTo === "number"
                    ? `${insurance.savingUpTo}%`
                    : "--"
                }
              />
              <StatCard
                icon={ShieldCheck}
                label="Plan ID"
                value={insurance._id.slice(-8).toUpperCase()}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <h2 className="text-[30px] leading-tight font-normal text-[#353535] sm:text-[34px]">
              Plan Information
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {infoRows.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-lg border border-[#E1E8F2] bg-[#FBFDFF] p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E5F0FF] text-[#004EB0]">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="montserrat text-lg font-semibold text-[#353535]">
                        {title}
                      </h3>
                      <p className="montserrat mt-1 text-base leading-relaxed text-[#5A5A5A]">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-[#DCE6F3] bg-[#F8FBFF] p-5 sm:p-6">
              <h2 className="text-[26px] leading-tight font-normal text-[#353535]">
                Included Support
              </h2>
              <div className="montserrat mt-4 grid gap-3 text-base text-[#4E4E4E] md:grid-cols-2">
                {[
                  "No-claims bonus protection",
                  "24/7 Central London recovery",
                  "Clear monthly member rate",
                  "Savings shown before purchase",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="shrink-0 text-[#004EB0]" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CircleDollarSign, Hash, CheckCircle2, XCircle, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentStatus = "success" | "failed";

interface PaymentAction {
  href: string;
  label: string;
}

interface PaymentStatusTemplateProps {
  status: PaymentStatus;
  title: string;
  description: string;
  badge: string;
  primaryAction: PaymentAction;
  secondaryAction: PaymentAction;
  checklist: string[];
  fallbackReason?: string;
}

const decodeParam = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
};

const formatDate = (dateValue: string) => {
  if (!dateValue) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }

  const decoded = decodeParam(dateValue);
  const parsedDate = new Date(decoded);

  if (Number.isNaN(parsedDate.getTime())) {
    return decoded;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const formatAmount = (amountValue: string, currencyValue: string) => {
  if (!amountValue) return "N/A";

  const amount = Number(amountValue);
  const currency = currencyValue || "GBP";

  if (!Number.isFinite(amount)) {
    return `${currency} ${decodeParam(amountValue)}`;
  }

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export default function PaymentStatusTemplate({
  status,
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  checklist,
  fallbackReason = "Your payment could not be completed. Please try again in a moment.",
}: PaymentStatusTemplateProps) {
  const searchParams = useSearchParams();
  const isSuccess = status === "success";
  const StatusIcon = isSuccess ? CheckCircle2 : XCircle;

  const transactionId =
    searchParams.get("transactionId") ||
    searchParams.get("orderId") ||
    searchParams.get("session_id") ||
    searchParams.get("trxId") ||
    "";

  const amountValue = searchParams.get("amount") || searchParams.get("total") || "";
  const currencyValue = (searchParams.get("currency") || "GBP").toUpperCase();
  const dateValue = searchParams.get("date") || searchParams.get("createdAt") || "";
  const reasonValue = searchParams.get("reason") || searchParams.get("message") || fallbackReason;

  const displayTransactionId = transactionId ? decodeParam(transactionId) : "N/A";
  const displayAmount = formatAmount(amountValue, currencyValue);
  const displayDate = formatDate(dateValue);
  const displayReason = decodeParam(reasonValue);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_#D7E9FF_0%,_#EEF5FF_45%,_#F8FBFF_80%)]" />

      <motion.div
        className={cn(
          "pointer-events-none absolute -left-16 top-24 -z-10 h-64 w-64 rounded-full blur-3xl",
          isSuccess ? "bg-[#2C7BE5]/30" : "bg-[#F87171]/25"
        )}
        animate={{ y: [0, -18, 0], x: [0, 12, 0], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 8.5, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute -right-16 bottom-10 -z-10 h-72 w-72 rounded-full blur-3xl",
          isSuccess ? "bg-[#004EB0]/25" : "bg-[#FB7185]/25"
        )}
        animate={{ y: [0, 14, 0], x: [0, -12, 0], opacity: [0.35, 0.58, 0.35] }}
        transition={{ duration: 9.2, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="rounded-[28px] border border-white/85 bg-white/85 p-6 shadow-[0_26px_70px_rgba(0,78,176,0.17)] backdrop-blur-xl sm:p-8 md:p-10">
          <div className="text-center">
            <span
              className={cn(
                "montserrat inline-flex rounded-full px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase",
                isSuccess ? "bg-[#E2EEFF] text-[#0057C3]" : "bg-[#FDEBEC] text-[#CC3543]"
              )}
            >
              {badge}
            </span>

            <motion.div
              className={cn(
                "mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border",
                isSuccess
                  ? "border-[#8AB6F3] bg-[#E9F3FF] text-[#0057C3]"
                  : "border-[#F4A9B0] bg-[#FFF1F2] text-[#CC3543]"
              )}
              initial={{ scale: 0.75, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
              >
                <StatusIcon className="size-11" strokeWidth={2.2} />
              </motion.div>
            </motion.div>

            <h1 className="mt-6 text-3xl leading-tight text-[#102D56] sm:text-4xl">{title}</h1>
            <p className="montserrat mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#4F607A] sm:text-base">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#DAE8FC] bg-[#F7FAFF] p-4">
              <div className="montserrat flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#6A7E9B] uppercase">
                <Hash className="size-4" />
                Transaction
              </div>
              <p className="montserrat mt-2 break-all text-sm font-semibold text-[#24476E]">{displayTransactionId}</p>
            </div>

            <div className="rounded-2xl border border-[#DAE8FC] bg-[#F7FAFF] p-4">
              <div className="montserrat flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#6A7E9B] uppercase">
                <CircleDollarSign className="size-4" />
                Amount
              </div>
              <p className="montserrat mt-2 text-sm font-semibold text-[#24476E]">{displayAmount}</p>
            </div>

            <div className="rounded-2xl border border-[#DAE8FC] bg-[#F7FAFF] p-4">
              <div className="montserrat flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#6A7E9B] uppercase">
                <CalendarDays className="size-4" />
                Date
              </div>
              <p className="montserrat mt-2 text-sm font-semibold text-[#24476E]">{displayDate}</p>
            </div>
          </div>

          {!isSuccess && (
            <div className="mt-4 rounded-2xl border border-[#FAD0D5] bg-[#FFF5F6] p-4">
              <div className="montserrat flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#B34354] uppercase">
                <TriangleAlert className="size-4" />
                Reason
              </div>
              <p className="montserrat mt-2 text-sm text-[#8A3C49]">{displayReason}</p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-[#DDEAFF] bg-[#F9FCFF] p-5">
            <h2 className="montserrat text-sm font-semibold tracking-[0.08em] text-[#3A5D87] uppercase">
              {isSuccess ? "What Happens Next" : "Quick Fix Checklist"}
            </h2>
            <ul className="mt-3 space-y-2">
              {checklist.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                  className="montserrat flex items-start gap-2 text-sm text-[#4D627F]"
                >
                  <span
                    className={cn(
                      "mt-[3px] inline-flex h-2.5 w-2.5 rounded-full",
                      isSuccess ? "bg-[#3F83F8]" : "bg-[#EC6A75]"
                    )}
                  />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              className={cn(
                "montserrat h-12 rounded-[12px] text-sm font-semibold",
                isSuccess
                  ? "bg-[#004EB0] text-white shadow-[0_12px_20px_rgba(0,78,176,0.28)] hover:bg-[#00449A]"
                  : "bg-[#D63638] text-white shadow-[0_12px_20px_rgba(214,54,56,0.24)] hover:bg-[#BC2D2F]"
              )}
            >
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="montserrat h-12 rounded-[12px] border-[#C8DBF7] bg-white text-sm font-semibold text-[#24528D] hover:border-[#AAC7EE] hover:bg-[#EEF5FF]"
            >
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

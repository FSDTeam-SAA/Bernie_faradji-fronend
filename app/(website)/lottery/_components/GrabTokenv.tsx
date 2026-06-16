"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

interface PrizeApiItem {
  _id: string;
  prizeTag?: string;
  isActive?: boolean;
}

interface PrizesApiResponse {
  success: boolean;
  message?: string;
  data?: {
    prizes?: PrizeApiItem[];
  };
}

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
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

const fetchPrizes = async (): Promise<PrizeApiItem[]> => {
  const response = await fetch(`${getApiBaseUrl()}/prizes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readApiErrorMessage(
        response,
        "Something went wrong while fetching prizes.",
      ),
    );
  }

  const data: PrizesApiResponse = await response.json();
  return data.data?.prizes ?? [];
};

const getPrizeMoney = (prizeTag?: string): string | null => {
  const match = prizeTag?.match(/£\s*[\d,]+(?:\.\d{1,2})?/);

  if (!match) {
    return null;
  }

  const value = Number(match[0].replace(/[£,\s]/g, ""));

  if (!Number.isFinite(value)) {
    return match[0].replace(/\s+/g, "");
  }

  return gbpFormatter.format(value);
};

const getPrizeTitle = (prizeTag?: string): string => {
  const title = prizeTag
    ?.replace(/£\s*[\d,]+(?:\.\d{1,2})?/, "")
    .replace(/\s+/g, " ")
    .trim();

  return title || "Driver Reward";
};

const PrizeHighlightSkeleton = () => (
  <div className="mx-auto mb-10 max-w-4xl overflow-hidden rounded-xl border border-[#D8E6F7] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-6">
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-36 animate-pulse rounded bg-[#DCE8F6]" />
        <div className="mt-4 h-8 w-56 animate-pulse rounded bg-[#E8EEF7]" />
        <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-[#EEF3FA]" />
      </div>
      <div className="h-20 w-full animate-pulse rounded-lg bg-[#E6F0FB] md:w-56" />
    </div>
  </div>
);

export default function GrabToken() {
  const [tokenCount, setTokenCount] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const session = useSession();
  const token = session.data?.accessToken;

  const tokenPrice = 5;
  const {
    data: prizes = [],
    isLoading: isPrizesLoading,
    isError: isPrizesError,
    error: prizesError,
  } = useQuery<PrizeApiItem[], Error>({
    queryKey: ["lottery-prizes"],
    queryFn: fetchPrizes,
  });

  const activePrize = prizes.find((prize) => prize.isActive === true);
  const activePrizeTitle = getPrizeTitle(activePrize?.prizeTag);
  const activePrizeMoney = getPrizeMoney(activePrize?.prizeTag);
  const activePrizeDisplay = activePrizeMoney ?? "Coming soon";

  const handleIncrease = () => setTokenCount((prev) => prev + 1);

  const handleDecrease = () =>
    setTokenCount((prev) => (prev > 1 ? prev - 1 : 1));

  const mutation = useMutation({
    mutationFn: async (payload: {
      quantity: number;
      vehicleNumber: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tokens/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create checkout session",
        );
      }

      return response.json();
    },

    onSuccess: (data) => {
      if (data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error("Invalid response from server");
      }
    },

    onError: (error: Error) => {
      toast.error("Payment Failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleProceed = () => {
    if (session.status !== "authenticated" || !token) {
      toast.error("Please login first");
      return;
    }

    if (!vehicleNumber.trim()) {
      toast.error("Please enter vehicle number");
      return;
    }

    if (!acceptTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    mutation.mutate({
      quantity: tokenCount,
      vehicleNumber: vehicleNumber.trim(),
    });
  };

  return (
    <section
      id="grab-your-token"
      className="scroll-mt-32 py-20 md:scroll-mt-36 md:py-24 lg:py-28"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-normal text-[#4E4E4E] md:text-5xl">
            Grab Your Token
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#4E4E4E] md:text-lg md:leading-8">
            Bubbledrive  is dedicated to creating exciting prize
            opportunities for drivers through a unique token raffle platform.
            For a minimum entry of £5, participants can purchase 1 token, which
            is assigned a unique raffle number and delivered via SMS or email.
            Each token provides an entry into a prize draw, giving players the
            opportunity to win life-changing rewards.
            <br />
            <br />
            Our draws feature a range of prizes that may include cash prizes
            exceeding £50,000, free insurance for over five years, and many
            other valuable rewards. By offering affordable entry and substantial
            prize opportunities, Bubbledrive aims to provide drivers with a
            fresh and engaging way to participate in prize draws.
            <br />
            <br />
            Bubbledrive is revolutionising the way players win by introducing
            what we believe is the first raffle and lottery-style platform
            dedicated exclusively to drivers. Our mission is to deliver exciting
            prize experiences while rewarding the driving community with
            opportunities that are relevant, valuable, and potentially
            life-changing.
            <br />
            <br />
            Every token purchased represents a chance to win, making
            participation simple, accessible, and exciting. Whether players are
            hoping to secure a major cash prize, reduce their motoring costs
            through insurance rewards, or win one of our many additional prizes,
            Bubbledrive is committed to providing a transparent and enjoyable
            experience for all participants.
          </p>
        </div>

        {isPrizesLoading ? (
          <PrizeHighlightSkeleton />
        ) : isPrizesError ? (
          <motion.div
            className="montserrat mx-auto mb-10 max-w-4xl rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-center text-sm text-red-600"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            {prizesError?.message || "Failed to load active prize."}
          </motion.div>
        ) : activePrize ? (
          <motion.div
            className="relative mx-auto mb-10 max-w-4xl overflow-hidden rounded-xl border border-[#C9DCF4] bg-[linear-gradient(135deg,#FFFFFF_0%,#F3F8FF_58%,#FFFFFF_100%)] shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-1 bg-[#004EB0]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />

            <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)] md:items-center md:p-7">
              <div className="min-w-0">
                <div className="montserrat montserrat inline-flex items-center gap-2 rounded-full border border-[#BFD8F6] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#004EAF]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Current Active Prize
                </div>

                <h3 className="mt-4 text-2xl font-normal leading-tight text-[#2F3A4A] md:text-4xl montserrat">
                  {activePrizeTitle}
                </h3>

                <p className="montserrat mt-3 max-w-2xl text-sm leading-6 text-[#5D6676] md:text-base">
                  Every purchased token enters this active draw, with the prize
                  money shown live from the current lottery reward.
                </p>
              </div>

              <motion.div
                className="relative flex min-h-[164px] w-full transform-gpu flex-col items-center justify-center overflow-hidden rounded-lg border border-[#BFD8F6] bg-white p-5 text-center shadow-[0_14px_36px_rgba(0,78,176,0.13)] will-change-transform md:min-h-[176px]"
                animate={
                  prefersReducedMotion ? undefined : { y: [0, -3, 0] }
                }
                transition={{
                  duration: 5.6,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-24 w-16 transform-gpu bg-white/65 blur-sm will-change-transform"
                  animate={
                    prefersReducedMotion ? undefined : { x: ["0%", "620%"] }
                  }
                  transition={{
                    duration: 6.4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backfaceVisibility: "hidden" }}
                />

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#004EB0] text-white">
                  <Trophy className="h-6 w-6" aria-hidden="true" />
                </div>

                <p className="montserrat mt-4 text-sm font-medium text-[#5D6676]">
                  {activePrizeMoney ? "Prize Money" : "Prize Update"}
                </p>

                <motion.p
                  key={activePrizeDisplay}
                  className={`montserrat mt-1 max-w-full break-words font-bold leading-tight text-[#004EB0] tabular-nums ${
                    activePrizeMoney
                      ? "text-3xl md:text-4xl"
                      : "text-2xl md:text-3xl"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                >
                  {activePrizeDisplay}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="montserrat mx-auto mb-10 max-w-4xl rounded-lg border border-[#D8E2F1] bg-white px-5 py-4 text-center text-sm text-[#5D6676]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            No active lottery prize available right now for this zone.
          </motion.div>
        )}

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          {/* Token Selector */}
          <div className="mb-4">
            <label className="montserrat mb-4 block text-xl font-medium text-[#2A2A2A]">
              One Token Costs £{tokenPrice}{" "}
              <span className="text-xl text-[#8C311E]">*</span>
            </label>

            <div className="flex w-full max-w-78 items-center gap-3 rounded-lg border border-[#004EB0] p-3 montserrat">
              <div className="grid min-w-0 flex-1 grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center rounded-[12px] bg-[#E5F0FF] px-2 py-1">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center transition"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-2xl text-[#004EB0]">
                    -
                  </span>
                </button>

                <span className="px-2 text-center text-sm font-medium text-gray-800 tabular-nums md:text-base">
                  <span className="inline-block min-w-[3ch] text-right">
                    {tokenCount}
                  </span>{" "}
                  Token{tokenCount > 1 ? "s" : ""}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center transition"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-2xl text-[#004EB0]">
                    +
                  </span>
                </button>
              </div>

              <div className="shrink-0 rounded-lg bg-[#004EB0] px-4 py-2 font-medium tabular-nums text-white">
                £{tokenCount * tokenPrice}
              </div>
            </div>
          </div>

          {/* Vehicle Number */}
          <div className="mb-4">
            <label className="montserrat mb-2 block text-base font-medium text-gray-700">
              Vehicle Number <span className="text-[#8C311E]">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter Vehicle Number..."
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="montserrat h-12 w-full rounded-lg bg-[#EAEAEA] px-4 uppercase text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4 flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer accent-[#004EAF]"
            />

            <label htmlFor="terms" className="montserrat text-sm text-gray-700">
              I accept all{" "}
              <Link
                href="/terms&condition"
                className="font-medium text-[#004EAF] underline hover:text-[#003a83]"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={mutation.isPending || !vehicleNumber.trim()}
            className="montserrat mt-4 h-12 w-full cursor-pointer rounded-md bg-[#004EAF] text-base font-bold text-white transition hover:bg-[#004EAF]/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? "Processing..." : "Proceed"}
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function GrabToken() {
  const [tokenCount, setTokenCount] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const session = useSession();
  const token = session.data?.accessToken;

  const tokenPrice = 5;

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

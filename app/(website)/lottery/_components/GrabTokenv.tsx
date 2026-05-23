'use client';

import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from "next-auth/react";

export default function GrabToken() {
  const [tokenCount, setTokenCount] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const session=useSession();
  const token=session.data?.accessToken
 
  
  const tokenPrice = 15;

  const handleIncrease = () => setTokenCount((prev) => prev + 1);
  const handleDecrease = () =>
    setTokenCount((prev) => (prev > 1 ? prev - 1 : 1));

  // TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: async (payload: { quantity: number; vehicleNumber: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tokens/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success('Checkout session created!', {
        description: 'Redirecting to payment page...',
      });

      // Redirect to Stripe Checkout URL
      if (data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error('Invalid response from server');
      }
    },
    onError: (error: Error) => {
      toast.error('Payment Failed', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });

  const handleProceed = () => {
    if (!vehicleNumber.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    mutation.mutate({
      quantity: tokenCount,
      vehicleNumber: vehicleNumber.trim(),
    });
  };

  return (
    <section className="py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-normal text-[#4E4E4E] md:text-5xl">
            Grab Your Token
          </h2>
          <p className="mt-3 text-sm text-[#4E4E4E] md:text-2xl">
            Take your desired token
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          {/* Token Selector */}
          <div className="mb-4">
            <label className="block montserrat text-xl font-medium text-[#2A2A2A] mb-4">
              One Token Costs £{tokenPrice} <span className="text-[#8C311E] text-xl">*</span>
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
                  className="flex h-10 w-10 shrink-0 items-center cursor-pointer justify-center transition"
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
            <label className="block text-base montserrat font-medium text-gray-700 mb-2">
              Vehicle Number <span className="text-[#8C311E]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Vehicle Number..."
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full rounded-lg bg-[#EAEAEA] uppercase montserrat px-4 h-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={mutation.isPending || !vehicleNumber.trim()}
            className="w-full mt-4 h-12 cursor-pointer montserrat rounded-md bg-[#004EAF] text-white font-bold text-base hover:bg-[#004EAF]/90 transition disabled:opacity-70"
          >
            {mutation.isPending ? 'Processing...' : 'Proceed '}
          </button>
        </div>
      </div>
    </section>
  );
}
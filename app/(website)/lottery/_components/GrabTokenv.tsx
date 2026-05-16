'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GrabToken() {
  const [tokenCount, setTokenCount] = useState(1);
  const tokenPrice = 15;

  const handleIncrease = () => setTokenCount((prev) => prev + 1);
  const handleDecrease = () =>
    setTokenCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleProceed = () => {
    alert(`You selected ${tokenCount} token(s) costing £${tokenCount * tokenPrice}`);
  };

  return (
    <section className=" py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6 ">
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center transition"
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
              Vehicle Number *
            </label>
            <input
              type="text"
              placeholder="Enter Vehicle Number..."
              className="w-full rounded-lg bg-[#EAEAEA] montserrat  px-4 h-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            className="w-full mt-4 h-12 cursor-pointer !montserrat rounded-md bg-[#004EAF] text-white font-bold text-base  hover:bg-[#004EAF]/90 transition"
          >
            Proceed
          </Button>
        </div>
      </div>
    </section>
  );
}

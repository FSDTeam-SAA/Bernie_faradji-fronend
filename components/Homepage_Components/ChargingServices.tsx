"use client";

import { useQuery } from "@tanstack/react-query";
import { Car } from "lucide-react";
import Link from "next/link";

interface CategoryApiItem {
  _id: string;
  name?: string;
  icon?: string;
  isActive?: boolean;
}

interface CategoriesApiResponse {
  success: boolean;
  message?: string;
  data?: {
    categories?: CategoryApiItem[];
  };
}

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  return apiBaseUrl.replace(/\/+$/, "");
};

const readApiErrorMessage = async (
  response: Response,
  fallbackMessage = "Failed to load categories.",
): Promise<string> => {
  const data = await response.json().catch(() => null);

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
};

const fetchCategories = async (): Promise<CategoryApiItem[]> => {
  const response = await fetch(`${getApiBaseUrl()}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  const data: CategoriesApiResponse = await response.json();
  const categories = data.data?.categories ?? [];
  return categories.filter((category) => category.isActive === true);
};

const CategoryCardSkeleton = () => (
  <div className="group relative overflow-hidden rounded-lg bg-white px-6 py-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
    <div className="absolute inset-x-0 top-0 h-1 bg-[#005cc8]/35" />
    <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[#005cc8]/25" />
    <div className="mx-auto mt-5 h-5 w-36 animate-pulse rounded bg-[#E4EBF5]" />
  </div>
);

export default function ChargingServices() {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery<CategoryApiItem[], Error>({
    queryKey: ["homepage-charging-categories"],
    queryFn: fetchCategories,
  });

  return (
    <section id="journey-plan" className="scroll-mt-28 bg-[#F8FBFF] py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-normal leading-tight text-[#4E4E4E] md:text-[50px]">
            Charging Services Overview
          </h2>

          <p className="mt-6  max-w-[640px] mx-auto text-sm leading-6 text-[#6f7380] md:text-base">
            Monitor and manage all your city driving charges from a single
            dashboard. Stay compliant with London&apos;s environmental and
            congestion regulations effortlessly.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          ) : isError ? (
            <div className="col-span-full rounded-lg border border-red-100 bg-red-50 px-4 py-5 text-center text-sm text-red-600">
              {error?.message || "Failed to load charging services."}
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full rounded-lg border border-[#D8E2F1] bg-white px-4 py-5 text-center text-sm text-[#5D6676]">
              No charging categories available right now.
            </div>
          ) : (
            categories.map((category) => {
              const title = category.name?.trim() || "Journey Category";
              const iconUrl = category.icon?.trim();

              return (
                <div
                  key={category._id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-white px-6 py-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,91,200,0.20)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-[#005cc8] transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="mx-auto flex items-center justify-center overflow-hidden  transition-all duration-500 ">
                    {iconUrl ? (
                      <span
                        aria-label={`${title} icon`}
                        role="img"
                        className="h-14 w-14  bg-cover rounded-full bg-no-repeat"
                        style={{ backgroundImage: `url(${iconUrl})` }}
                      />
                    ) : (
                      <Car size={24} strokeWidth={2.4} />
                    )}
                  </div>

                  <h3 className="mt-5 text-base font-medium text-[#555] transition-colors duration-300 group-hover:text-[#005cc8]">
                    {title}
                  </h3>

                  <div className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#005cc8]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              );
            })
          )}
        </div>

        <div className="mt-12 flex justify-center">
           <Link href="/journey">
          <button
            className="h-14 cursor-pointer montserrat rounded-md bg-[#004EB0] px-10 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#004EB0]/90 hover:shadow-xl"
          >
           Plan Your Journey
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from "framer-motion";
import InsuranceCard from "./InsuranceCard";
import { useQuery } from "@tanstack/react-query";

interface InsuranceApiItem {
  _id: string;
  name?: string;
  shortDetails?: string;
  rate?: number;
  savingUpTo?: number;
  url?: string;
}

// Skeleton Component
const InsuranceCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="flex gap-2 pt-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 rounded-full w-28" />
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded-xl mt-6" />
    </div>
  </div>
);

export default function InsuranceListing() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["insurances"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurances`);
      if (!res.ok) throw new Error("Failed to fetch insurances");
      return res.json();
    },
  });

  const insurances: InsuranceApiItem[] = data?.data?.insurances || [];

  return (
    <section className="bg-[#F8FBFF] py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mx-auto">
          <h2 className="text-3xl font-normal text-[#4E4E4E] md:text-5xl">
            Insurance Listing
          </h2>
          <p className="mt-2 text-sm text-[#4E4E4E] md:text-base">
            Explore Our Helpful Insurance Plans
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:auto-rows-fr lg:grid-cols-3">
          {isLoading ? (
            // Skeleton Loaders
            [...Array(6)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <InsuranceCardSkeleton />
              </motion.div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500">Failed to load insurance plans</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            insurances.map((item, idx) => (
              <motion.div
                key={item._id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <InsuranceCard
                  id={item._id}
                  title={item.name || "Insurance Plan"}
                  description={item.shortDetails || "No details available for this insurance plan."}
                  // Map features if you have them in API, otherwise keep empty or add defaults
                  features={["No-claims bonus protection", "24/7 Central London recovery"]}
                  memberRate={`£${Number(item.rate ?? 0).toFixed(2)}/mo`}
                  detailsUrl={item.url}
                  saveText={
                    typeof item.savingUpTo === "number"
                      ? `Save ${item.savingUpTo}%`
                      : undefined
                  }
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

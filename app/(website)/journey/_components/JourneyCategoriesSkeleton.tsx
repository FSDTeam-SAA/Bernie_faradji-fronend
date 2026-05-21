'use client';

export default function JourneyCategoriesSkeleton() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[10px] border border-[#DCE6F3] bg-white p-3.5"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="size-8 rounded-[8px] bg-[#E7EEF9]" />
            <div className="size-4 rounded-full border border-[#CBD7E8] bg-[#F4F7FC]" />
          </div>

          <div className="h-7 w-3/4 rounded bg-[#E7EEF9]" />
          <div className="mt-3 h-4 w-full rounded bg-[#EEF3FA]" />
          <div className="mt-2 h-4 w-11/12 rounded bg-[#EEF3FA]" />

          <div className="mt-3 flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-[#E7EEF9]" />
            <div className="h-6 w-20 rounded-[4px] bg-[#E6EDF7]" />
          </div>

          <div className="mt-2 h-8 w-24 rounded bg-[#DFEAF8]" />
        </div>
      ))}
    </div>
  );
}

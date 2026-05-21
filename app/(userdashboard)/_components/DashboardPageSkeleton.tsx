"use client";

export default function DashboardPageSkeleton() {
  return (
    <div className="w-full montserrat animate-pulse">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg bg-[#002A5D] p-4 sm:p-6">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-white/30" />
            <div className="h-10 w-16 rounded bg-white/40" />
          </div>
          <div className="h-10 w-10 rounded-[12px] bg-white/50 sm:h-12 sm:w-12" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#004EAF] p-4 sm:p-6">
          <div className="space-y-3">
            <div className="h-4 w-36 rounded bg-white/30" />
            <div className="h-10 w-16 rounded bg-white/40" />
          </div>
          <div className="h-10 w-10 rounded-[12px] bg-white/50 sm:h-12 sm:w-12" />
        </div>
      </div>

      <div>
        <div className="mb-4 h-6 w-40 rounded bg-slate-300" />
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
          <div className="grid grid-cols-4 gap-4 bg-[#E0EEFF] p-4">
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
          </div>

          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-8 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

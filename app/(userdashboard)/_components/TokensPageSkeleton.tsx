"use client";

export default function TokensPageSkeleton() {
  return (
    <div className="w-full montserrat animate-pulse">
      <div className="mb-8">
        <div className="mb-2 h-7 w-28 rounded bg-slate-300" />
        <div className="rounded-lg bg-white p-4 shadow sm:p-6">
          <div className="mx-auto w-full rounded-lg bg-slate-400 px-4 py-8 sm:max-w-sm sm:py-10">
            <div className="mx-auto mb-3 h-4 w-16 rounded bg-white/50" />
            <div className="mx-auto h-6 w-44 rounded bg-white/60" />
            <div className="mx-auto mt-3 h-4 w-32 rounded bg-white/40" />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 h-7 w-36 rounded bg-slate-300" />
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
          <div className="grid grid-cols-6 gap-4 bg-[#E0EEFF] p-4">
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
          </div>

          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4">
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

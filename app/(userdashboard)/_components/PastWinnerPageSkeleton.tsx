"use client";

export default function PastWinnerPageSkeleton() {
  return (
    <div className="w-full montserrat animate-pulse">
      <div className="mb-6 h-8 w-44 rounded bg-slate-300" />

      <div>
        <div className="mb-2 h-6 w-48 rounded bg-slate-300" />
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
          <div className="grid grid-cols-7 gap-4 bg-[#E0EEFF] p-4">
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
            <div className="h-4 rounded bg-slate-300" />
          </div>

          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-7 gap-4">
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
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


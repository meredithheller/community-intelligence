function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  );
}

export function SkeletonIntelligenceCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      {/* Demographic */}
      <div className="px-6 py-5">
        <Shimmer className="h-3 w-40 mb-3" />
        <Shimmer className="h-4 w-full mb-2" />
        <Shimmer className="h-4 w-4/5" />
      </div>

      {/* Tone */}
      <div className="px-6 py-5">
        <Shimmer className="h-3 w-12 mb-3" />
        <div className="flex gap-2 mb-3">
          <Shimmer className="h-6 w-20 rounded-full" />
          <Shimmer className="h-6 w-16 rounded-full" />
          <Shimmer className="h-6 w-24 rounded-full" />
          <Shimmer className="h-6 w-18 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>

      {/* Language */}
      <div className="px-6 py-5">
        <Shimmer className="h-3 w-20 mb-3" />
        <Shimmer className="h-3 w-24 mb-2" />
        <div className="flex gap-2 mb-3">
          <Shimmer className="h-5 w-14 rounded" />
          <Shimmer className="h-5 w-10 rounded" />
          <Shimmer className="h-5 w-16 rounded" />
          <Shimmer className="h-5 w-12 rounded" />
        </div>
        <Shimmer className="h-3 w-10 mb-2" />
        <div className="flex gap-2">
          <Shimmer className="h-5 w-20 rounded" />
          <Shimmer className="h-5 w-24 rounded" />
          <Shimmer className="h-5 w-16 rounded" />
        </div>
      </div>

      {/* Formats */}
      <div className="px-6 py-5">
        <Shimmer className="h-3 w-40 mb-3" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-5/6" />
        </div>
      </div>

      {/* Hooks */}
      <div className="px-6 py-5">
        <Shimmer className="h-3 w-36 mb-3" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-2/3" />
          <Shimmer className="h-4 w-4/5" />
          <Shimmer className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonResponseOptions() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Shimmer className="h-5 w-36 rounded-full mb-3" />
              <Shimmer className="h-4 w-full mb-1.5" />
              <Shimmer className="h-4 w-full mb-1.5" />
              <Shimmer className="h-4 w-2/3 mb-4" />
              <Shimmer className="h-3 w-4/5 mb-1" />
              <Shimmer className="h-3 w-3/5" />
            </div>
            <Shimmer className="h-8 w-14 rounded-lg flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

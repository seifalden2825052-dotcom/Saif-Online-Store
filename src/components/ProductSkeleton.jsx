export default function ProductSkeleton({ featured = false, span = "" }) {
  return (
    <div
      aria-hidden
      className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface/50 ${span}`}
    >
      <div
        className={`shimmer relative w-full bg-bg-deep ${featured ? "min-h-[18rem]" : "min-h-[11rem]"} flex-1`}
      />
      <div className="space-y-3 p-6">
        <div className="shimmer h-3 w-24 rounded-full bg-bg-deep" />
        <div className="shimmer h-5 w-3/4 rounded-full bg-bg-deep" />
        <div className="shimmer h-3 w-1/2 rounded-full bg-bg-deep" />
        <div className="flex items-center justify-between pt-3">
          <div className="shimmer h-6 w-20 rounded-full bg-bg-deep" />
          <div className="shimmer h-9 w-28 rounded-full bg-bg-deep" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSkeleton({ featured = false, span = "" }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface ${span}`}>
      <div className={`relative overflow-hidden bg-bg-deep ${featured ? "min-h-[20rem] flex-1" : "aspect-[4/3]"}`}>
        <div className="shimmer absolute inset-0 bg-bg-deep" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="h-7 w-3/4 rounded-md bg-bg-deep" />
        <div className="mt-3 h-4 w-1/2 rounded-md bg-bg-deep" />
        
        <div className="mt-auto pt-6 flex items-end justify-between">
          <div className="h-6 w-16 rounded-md bg-bg-deep" />
          <div className="h-9 w-24 rounded-full bg-bg-deep" />
        </div>
      </div>
    </div>
  );
}

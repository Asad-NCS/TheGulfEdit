export default function ProductSkeleton() {
  return (
    <div className="border border-sand-dark overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[3/4] skeleton" />
      {/* Info placeholder */}
      <div className="p-4 border-t border-sand-dark space-y-3">
        <div className="skeleton h-3 w-16 rounded-none" />
        <div className="skeleton h-4 w-3/4 rounded-none" />
        <div className="skeleton h-3 w-1/3 rounded-none" />
        <div className="flex gap-1 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-4 w-8 rounded-none" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

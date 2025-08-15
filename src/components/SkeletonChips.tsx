export default function SkeletonChips({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gray-200 rounded-lg animate-pulse"
          style={{
            width: `${Math.random() * 200 + 150}px`
          }}
        />
      ))}
    </div>
  );
}


interface SkeletonLoaderProps {
  isSmall: boolean;
}

const SkeletonLoader = ({ isSmall }: SkeletonLoaderProps) => {
  if (isSmall) {
    // Mobile Layout - Return only the container (for use with flex-1)
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm animate-pulse"
            >
              {/* Skeleton Image */}
              <div className="h-20 w-24 rounded-lg bg-gray-300 shrink-0" />

              {/* Skeleton Text */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>

              {/* Skeleton Button */}
              <div className="shrink-0 w-10 h-10 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Layout - Return only the skeleton items (grid is parent's responsibility)
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="lg:w-[32%] lg:max-w-[325px] lg:min-w-[185px] bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col animate-pulse"
        >
          {/* Skeleton Image and Button Container */}
          <div className="flex flex-row justify-between items-center mb-2">
            <div className="bg-gray-300 h-20 w-24 rounded-lg min-w-20 max-w-30" />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>

          {/* Skeleton Text */}
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
      <div className="h-20 w-full" />
    </>
  );
};

export default SkeletonLoader;

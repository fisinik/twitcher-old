export const LoadingSkeleton = () => {
  return (
    <div className="relative m-2 h-96 w-72 overflow-hidden rounded-md bg-white shadow-2xl">
      <div className="absolute left-0 right-0 top-64 z-10 flex items-center gap-x-4 px-3">
        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-300" />
        <div className="flex flex-col">
          <div className="h-4 w-32 animate-pulse bg-gray-300" />
          <div className="h-3 w-24 animate-pulse bg-gray-300" />
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 flex justify-between px-3">
        <div className="h-4 w-24 animate-pulse bg-gray-300" />
        <div className="flex gap-x-4">
          <div className="h-4 w-12 animate-pulse bg-gray-300" />
          <div className="h-4 w-12 animate-pulse bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

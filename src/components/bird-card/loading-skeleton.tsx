export const LoadingSkeleton = () => {
  return (
    <div className="relative bg-white shadow-2xl overflow-hidden w-72 h-96 rounded-md m-2">
      <div className="absolute left-0 right-0 top-64 z-10 flex px-3 gap-x-4 items-center">
        <div className="w-14 h-14 rounded-full bg-gray-300 animate-pulse" />
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-gray-300 animate-pulse" />
          <div className="w-24 h-3 bg-gray-300 animate-pulse" />
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 px-3 flex justify-between">
        <div className="w-24 h-4 bg-gray-300 animate-pulse" />
        <div className="flex gap-x-4">
          <div className="w-12 h-4 bg-gray-300 animate-pulse" />
          <div className="w-12 h-4 bg-gray-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

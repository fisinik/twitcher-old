export const LoadingSkeleton = () => {
  return (
    <div className="relative bg-white shadow-2xl overflow-hidden w-72 h-96 rounded-md m-2">
      <div className="animate-pulse h-72 w-full bg-gray-300 rounded-t-md rounded-b-[45px]" />
      <div className="absolute left-0 right-0 bottom-5 z-10 flex flex-col items-center">
        <h2 className="animate-pulse h-6 w-3/4 bg-gray-300 rounded-md" />
        <p className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-md mt-2" />
      </div>
    </div>
  );
};

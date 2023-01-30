export default function Button({
  children, onClick, className, ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {

  return (
    <button
      className={`mt-[15px] h-[50px] rounded-[3px]  bg-gradient-to-l from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white shadow-2xl ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

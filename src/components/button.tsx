export default function Button({
  children, onClick, className, ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {

  return (
    <button
      className={`mt-[15px] h-[50px] rounded-[3px] opacity-90 bg-gradient-to-l from-teal-300 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white shadow-2xl ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

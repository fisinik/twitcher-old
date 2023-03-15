import { motion } from "framer-motion";
export default function Button({
  children,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={`mt-[15px] h-[50px] rounded-[3px]  bg-gradient-to-l from-teal-400 to-teal-500 text-white shadow-2xl hover:from-teal-500 hover:to-teal-600 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

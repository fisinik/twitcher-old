export default function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
}: {
  label: string;
  type: "text" | "email" | "password" | "number" | "date" | "file" | "textarea";
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="relative my-[5px] w-full">
      {type !== "textarea" ? (
        <input
          type={type}
          name={name}
          id={`floating_${name}`}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`h-[50px] rounded-[3px] border-[1px] ${
            error ? "border-red-500" : "text-gray-800"
          } peer
          w-full bg-gradient-to-r from-teal-50 px-2.5 pb-2.5 pt-5 caret-teal-400 shadow-lg hover:to-teal-100 hover:shadow-xl focus:border-teal-400 focus:outline-none`}
          placeholder=" "
        />
      ) : (
        <textarea
          name={name}
          id={`floating_${name}`}
          className={`h-[150px] rounded-[3px] border ${
            error ? "border-red-500" : "text-gray-800"
          } peer w-full bg-gradient-to-r from-teal-50 to-teal-50 px-2.5 pb-2.5 pt-5
            caret-teal-400 shadow-lg hover:to-teal-100 hover:shadow-xl focus:border-teal-400 focus:outline-none`}
          placeholder=" "
          style={{ resize: `none` }}
        />
      )}
      <label
        htmlFor={`floating_${name}`}
        className="absolute top-4 left-4 z-10 origin-[0] -translate-y-4
        scale-75 transform text-sm text-gray-400 duration-300 peer-placeholder-shown:translate-y-0 
        peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
      >
        {label}
      </label>
      {error && (
        <span className="flex gap-x-2 pt-1">
          <svg
            aria-hidden="true"
            fill="#EF4444"
            focusable="false"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
          <p className="text-xs text-red-500">{error}</p>
        </span>
      )}
    </div>
  );
}

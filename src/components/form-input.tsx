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
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'file' | 'textarea';
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="relative my-[5px] w-full">
      {type !== 'textarea' ? (
        <input
          type={type} name={name} id={`floating_${name}`} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          className={`h-[50px] rounded-[3px] border-[1px] ${error ? 'border-red-500' : 'text-gray-800'} 
          bg-gray-100 px-2.5 pb-2.5 pt-5 w-full focus:outline-none caret-teal-400 focus:border-teal-400 peer`}
          placeholder=" "
        />
      ) : (
        <textarea
          name={name} id={`floating_${name}`}
          className="h-[150px] rounded-[3px] border text-gray-800 bg-gray-100 px-2.5 pb-2.5 pt-5 w-full
            focus:outline-none caret-teal-400 focus:border-teal-400 peer"
          placeholder=" "
          style={{ resize: `none` }}
        />
      )}
      <label
        htmlFor={`floating_${name}`}
        className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4
        scale-75 top-5 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
      {error && <span className="flex gap-x-2 pt-1">
        <svg aria-hidden="true" fill="#EF4444" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
          </path>
        </svg> <p className="text-red-500 text-xs">{error}</p></span>}
    </div>
  )
}

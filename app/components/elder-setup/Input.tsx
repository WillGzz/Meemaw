

export default function Input({
  label,
  placeholder,
  value,
  setValue,
  optional = false,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  optional?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">

        {label}

        {optional && (
          <span className="font-normal text-slate-400">
            Optional
          </span>
        )}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafafa] px-4 focus-within:border-[#172554]">

        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <input
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

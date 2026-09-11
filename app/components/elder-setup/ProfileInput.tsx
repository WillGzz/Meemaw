

export default function ProfileInput({
  icon,
  label,
  placeholder,
  value,
  setValue,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-600">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafafa] px-4 focus-within:border-[#172554]">

        <span className="text-slate-400">
          {icon}
        </span>

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

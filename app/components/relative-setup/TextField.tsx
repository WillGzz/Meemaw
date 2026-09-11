

export default function TextField({
  label,
  placeholder,
  value,
  setValue,
}: {
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

      <input
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#172554]"
      />
    </div>
  );
}

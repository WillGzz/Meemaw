import { Check } from "lucide-react";

export default function PreferenceCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
     type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[#172554] bg-[#f5f7ff]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[#172554]">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        {selected && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#172554] text-white">
            <Check size={14} />
          </div>
        )}
      </div>
    </button>
  );
}

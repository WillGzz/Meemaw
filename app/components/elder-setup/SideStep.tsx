import { Check } from "lucide-react";

export default function SideStep({
  number,
  title,
  active,
  complete,
}: {
  number: number;
  title: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
          complete
            ? "bg-green-100 text-green-700"
            : active
              ? "bg-[#172554] text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? <Check size={16} /> : number}
      </div>

      <p
        className={`font-semibold ${
          active
            ? "text-[#172554]"
            : "text-slate-400"
        }`}
      >
        {title}
      </p>
    </div>
  );
}

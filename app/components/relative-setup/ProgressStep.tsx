

export default function ProgressStep({
  number,
  active,
  title,
  text,
}: {
  number: number;
  active: boolean;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          active
            ? "bg-[#172554] text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {number}
      </div>

      <div>
        <p
          className={`font-bold ${
            active
              ? "text-[#172554]"
              : "text-slate-400"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

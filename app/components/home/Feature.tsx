import type { FeatureProps } from "./types";

export default function Feature({
  icon,
  title,
  text,
}: FeatureProps) {
  return (
    <div className="rounded-3xl bg-white/60 p-5 backdrop-blur">
      <div className="mb-3 text-[#ef5d70]">
        {icon}
      </div>

      <p className="font-bold text-[#172554]">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

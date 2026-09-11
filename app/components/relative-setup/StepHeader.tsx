import EndpointBadge from "@/app/components/EndpointBadge";

export default function StepHeader({
  icon,
  eyebrow,
  title,
  description,
  endpoint,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  endpoint: string;
}) {
  return (
    <div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#172554] shadow-sm">
        {icon}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#ef5d70]">
          {eyebrow}
        </p>

        <EndpointBadge label={endpoint} />
      </div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172554] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

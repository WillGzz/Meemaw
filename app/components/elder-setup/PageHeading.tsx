

export default function PageHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#172554]">
        {icon}
      </div>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172554] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

import { Plug } from "lucide-react";

type EndpointDotProps = {
  label: string;
};

export default function EndpointDot({
  label,
}: EndpointDotProps) {
  return (
    <span
      title={`Backend connection: ${label}`}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
        <Plug size={12} />
      </span>

      <span className="hidden sm:inline">
        {label}
      </span>
    </span>
  );
}
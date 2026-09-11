import { Plug } from "lucide-react";

type EndpointBadgeProps = {
  label?: string;
};

export default function EndpointBadge({
  label = "API",
}: EndpointBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
      <Plug size={13} />
      {label}
    </span>
  );
}
import { ArrowRight } from "lucide-react";

export default function ContinueButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#172554] font-bold text-white transition hover:bg-[#101b42] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 md:w-auto md:px-10"
    >
      Continue
      <ArrowRight size={19} />
    </button>
  );
}

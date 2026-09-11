import { ArrowLeft } from "lucide-react";
import EndpointBadge from "@/app/components/EndpointBadge";

export default function SetupHeader({ step, handleBack }: { step: number; handleBack: () => void; }) {
  return (
<header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 sm:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBack}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <p className="font-bold text-[#172554]">
              Relative setup
            </p>

            <p className="text-xs text-slate-400">
              Step {step} of 3
            </p>
          </div>

          <EndpointBadge label="AI integration" />
        </div>
      </header>
  );
}

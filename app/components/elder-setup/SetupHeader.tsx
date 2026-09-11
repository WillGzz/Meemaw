import { ArrowLeft } from "lucide-react";

export default function SetupHeader({ step, goBack }: { step: number; goBack: () => void; }) {
  return (
<header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">

        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <p className="font-bold text-[#172554]">
              Set Up Meemaw
            </p>

            <p className="text-xs text-slate-400">
              Step {step} of 3
            </p>
          </div>

          <div className="h-11 w-11" />
        </div>

        <div className="mt-3 flex gap-1.5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full ${
                item <= step
                  ? "bg-[#ef5d70]"
                  : "bg-slate-100"
              }`}
            />
          ))}
        </div>
      </header>
  );
}

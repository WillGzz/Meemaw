import { ArrowLeft } from "lucide-react";
import SideStep from "./SideStep";

export default function SetupSidebar({ step, goBack }: { step: number; goBack: () => void; }) {
  return (
<aside className="hidden md:block">
            <button
              type="button"
              onClick={goBack}
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#172554]"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ef5d70]">
              Getting started
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#172554]">
              Let&apos;s make Meemaw yours.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              A few simple questions help your
              assistant understand how to help you.
            </p>

            <div className="mt-10 space-y-7">
              <SideStep
                number={1}
                title="About you"
                active={step === 1}
                complete={step > 1}
              />

              <SideStep
                number={2}
                title="Your world"
                active={step === 2}
                complete={step > 2}
              />

              <SideStep
                number={3}
                title="Your assistant"
                active={step === 3}
                complete={false}
              />
            </div>
          </aside>
  );
}

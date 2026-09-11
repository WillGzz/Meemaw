import ProgressStep from "./ProgressStep";

export default function SetupSidebar({ step }: { step: number; }) {
  return (
<aside className="hidden min-h-[calc(100dvh-77px)] border-r border-slate-200 bg-white p-8 lg:block">
          <h2 className="text-xl font-bold text-[#172554]">
            Connect your family
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This information helps Meemaw understand
            who you are in the elder&apos;s life.
          </p>

          <div className="mt-8 space-y-5">
            <ProgressStep
              number={1}
              active={step >= 1}
              title="Find elder"
              text="Choose who you're connecting with."
            />

            <ProgressStep
              number={2}
              active={step >= 2}
              title="Your relationship"
              text="Tell Meemaw who you are."
            />

            <ProgressStep
              number={3}
              active={step >= 3}
              title="Connect context"
              text="Add approved public profiles."
            />
          </div>
        </aside>
  );
}

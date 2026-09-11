

export default function DesktopNavigation() {
  return (
    <nav className="hidden border-b border-slate-200 bg-white md:block">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f3] font-bold text-[#ef5d70]">
            M
          </div>

          <span className="text-xl font-bold text-[#172554]">
            Meemaw
          </span>
        </div>

        <div className="flex items-center gap-7 text-sm font-semibold text-slate-500">
          {[
            { title: "How it works", text: "Tell us about yourself, optionally add public profiles, then choose your assistant preferences. Select Continue to move through setup." },
            { title: "About", text: "Meemaw is a prototype designed to help older adults stay connected with family through simple voice conversations. Voice and account integrations are still being developed." },
            { title: "Help", text: "Enter your name and location to continue. Public profiles are optional. Use Back to revisit a step; your entries stay available during setup." },
          ].map(({ title, text }) => (
            <details key={title} name="navigation-info" className="group relative">
              <summary className="cursor-pointer rounded-lg px-2 py-1 hover:text-[#172554] group-open:text-[#172554]">
                {title}
              </summary>
              <div className="absolute right-0 top-full z-40 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-5 text-sm font-normal leading-6 text-slate-600 shadow-lg">
                {text}
              </div>
            </details>
          ))}
        </div>
      </div>
    </nav>
  );
}

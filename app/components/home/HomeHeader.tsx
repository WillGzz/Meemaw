import { HeartHandshake } from "lucide-react";

export default function HomeHeader() {
  return (
<header className="hidden border-b border-slate-200 bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0f2]">
              <HeartHandshake className="text-[#ef5d70]" />
            </div>

            <div>
              <p className="text-xl font-bold text-[#172554]">
                Meemaw
              </p>

              <p className="text-xs text-slate-400">
                Family connection made simple
              </p>
            </div>
          </div>

          <a href="/login" className="font-semibold text-[#172554] underline">Sign in</a>
        </div>
      </header>
  );
}

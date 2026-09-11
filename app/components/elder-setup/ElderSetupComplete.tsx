import { Bot } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Mic } from "lucide-react";
import EndpointDot from "@/app/components/EndpointDot";
import DesktopNavigation from "./DesktopNavigation";

export default function ElderSetupComplete({ name, preferredName, onReturnHome }: { name: string; preferredName: string; onReturnHome: () => void; }) {
 return (
<main className="min-h-dvh bg-white md:bg-[#f6f7f9]">
        <DesktopNavigation />

        <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-5 py-10 md:min-h-[calc(100dvh-73px)]">

          <div className="w-full max-w-xl md:rounded-[32px] md:border md:border-slate-200 md:bg-white md:p-10 md:shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={40}
                className="text-green-700"
              />
            </div>

            <div className="mt-7 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                You&apos;re ready
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#172554] sm:text-4xl">
                Welcome to Meemaw,{" "}
                {preferredName || name}.
              </h1>

              <p className="mt-4 leading-7 text-slate-500">
                Your assistant is ready to help
                you stay connected with family and
                friends.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#fff1f3] p-5">
              <div className="flex gap-4">
                <Mic
                  size={26}
                  className="shrink-0 text-[#ef5d70]"
                />

                <div>
                  <p className="font-bold text-[#172554]">
                    Try saying
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    “What has my grandson been up to?”
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <Bot
                  size={23}
                  className="shrink-0 text-green-700"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-green-900">
                      Elder agent ready
                    </p>

                    <EndpointDot label="POST elder agent" />
                  </div>

                  <p className="mt-1 text-sm leading-6 text-green-800">
                    The AI backend can now create the
                    elder&apos;s primary agent from
                    this profile.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onReturnHome}
              className="mt-8 h-14 w-full rounded-2xl bg-[#172554] font-bold text-white"
            >
              Return home
            </button>
          </div>
        </div>
      </main>
 );
}

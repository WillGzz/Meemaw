import { Bot } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import EndpointBadge from "@/app/components/EndpointBadge";
import type { Elder } from "./types";

export default function RelativeSetupComplete({ name, selectedElder, relationship, onReturnHome }: { name: string; selectedElder: Elder | null; relationship: string; onReturnHome: () => void; }) {
 return (
<main className="min-h-dvh bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-dvh max-w-4xl items-center justify-center px-5 py-10">
          <div className="w-full rounded-3xl bg-white p-7 shadow-sm sm:p-10 md:border md:border-slate-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={40}
                className="text-green-700"
              />
            </div>

            <div className="mx-auto mt-6 max-w-xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-green-700">
                Setup complete
              </p>

              <h1 className="mt-3 text-3xl font-bold text-[#172554] sm:text-4xl">
                You&apos;re connected.
              </h1>

              <p className="mt-4 leading-7 text-slate-500">
                Meemaw now knows that{" "}
                <strong className="text-[#172554]">
                  {name}
                </strong>{" "}
                is {selectedElder?.name}&apos;s{" "}
                {relationship.toLowerCase()}.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-4">
                <Bot
                  size={25}
                  className="mt-0.5 shrink-0 text-green-700"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-green-900">
                      Relative agent ready
                    </p>

                    <EndpointBadge label="POST agent" />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-green-800">
                    The AI backend can now use this
                    relationship and approved links as
                    context for the relative agent.
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-xl">
              <button
                type="button"
                onClick={onReturnHome}
                className="h-14 w-full rounded-full bg-[#172554] font-bold text-white"
              >
                Return home
              </button>
            </div>
          </div>
        </div>
      </main>
 );
}

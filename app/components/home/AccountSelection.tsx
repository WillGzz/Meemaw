import { ArrowRight } from "lucide-react";
import { UserRound } from "lucide-react";
import { UsersRound } from "lucide-react";
import type { AccountType } from "./types";

export default function AccountSelection({ selectedAccount, setSelectedAccount, handleContinue }: { selectedAccount: AccountType; setSelectedAccount: (account: AccountType) => void; handleContinue: () => void; }) {
  return (
<section className="flex items-center bg-white px-5 py-9 sm:px-10 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ef5d70]">
              Welcome to Meemaw
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172554] sm:text-4xl">
              How would you like to begin?
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Choose the account that best describes you.
              You can change this later.
            </p>

            <div className="mt-8 space-y-4">

              {/* ELDER */}
              <button
               type="button"
                aria-pressed={selectedAccount === "elder"}
                onClick={() => setSelectedAccount("elder")}
                className={`w-full rounded-3xl border p-5 text-left transition sm:p-6 ${
                  selectedAccount === "elder"
                    ? "border-[#172554] bg-[#f5f7ff] shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#edf1ff]">
                    <UserRound
                      size={27}
                      className="text-[#172554]"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#172554]">
                      I&apos;m using Meemaw
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Create an elder profile and use voice AI
                      to stay connected with the people you love.
                    </p>
                  </div>

                  
                </div>
              </button>

              {/* RELATIVE */}
              <button
               type="button"
                aria-pressed={selectedAccount === "relative"}
                onClick={() => setSelectedAccount("relative")}
                className={`w-full rounded-3xl border p-5 text-left transition sm:p-6 ${
                  selectedAccount === "relative"
                    ? "border-[#172554] bg-[#f5f7ff] shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f2]">
                    <UsersRound
                      size={27}
                      className="text-[#ef5d70]"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#172554]">
                      I&apos;m helping a relative
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Create your account and share information
                      that helps their AI assistant recognize you.
                    </p>
                  </div>

                  
                </div>
              </button>
            </div>

            <button
             type="button"
              disabled={!selectedAccount}
              onClick={handleContinue}
              className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#172554] text-base font-bold text-white transition hover:bg-[#101b42] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Continue
              <ArrowRight size={19} />
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              Already have an account? <a href="/login" className="font-semibold text-[#172554] underline">Sign in</a>
            </p>
          </div>
        </section>
  );
}

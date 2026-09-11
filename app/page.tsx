"use client";

import {
  ArrowRight,
  Bot,
  HeartHandshake,
  Link2,
  Mic,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

type AccountType = "elder" | "relative" | null;


import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedAccount, setSelectedAccount] =
    useState<AccountType>(null);
  
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-5 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">

        <div className="w-full max-w-[430px] overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)]">

          {/* Hero */}
          <div className="relative h-[270px] overflow-hidden bg-gradient-to-br from-[#dff5ef] via-[#e7efff] to-[#f7e9f1]">

            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />

            <div className="absolute right-4 top-20 h-48 w-48 rounded-full bg-[#9fd8ce]/40 blur-3xl" />

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-white shadow-xl">
                <HeartHandshake
                  size={48}
                  strokeWidth={1.8}
                  className="text-[#ec5d6f]"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur">
                <Sparkles size={16} className="text-[#ec5d6f]" />
                Family made simple
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-7">

            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                Welcome to Meemaw
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#172554]">
                Stay close to the people you love.
              </h1>

              <p className="mt-3 text-base leading-7 text-gray-500">
                Meemaw makes staying connected easier through simple
                conversations and voice-powered AI.
              </p>
            </div>

            <p className="mb-3 text-sm font-semibold text-gray-600">
              How would you like to get started?
            </p>

            <div className="space-y-3">

              {/* Elder option */}
              <button
                type="button"
                onClick={() => setSelectedAccount("elder")}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedAccount === "elder"
                    ? "border-[#172554] bg-[#f4f6ff]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1ff]">
                    <UserRound
                      size={25}
                      className="text-[#172554]"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#172554]">
                      Create my account
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      I want an easier way to talk with my family
                      and friends.
                    </p>
                  </div>
                </div>
              </button>

              {/* Relative option */}
              <button
                type="button"
                onClick={() => setSelectedAccount("relative")}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedAccount === "relative"
                    ? "border-[#172554] bg-[#f4f6ff]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f3]">
                    <UsersRound
                      size={25}
                      className="text-[#ec5d6f]"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-[#172554]">
                        Set up a relative
                      </h2>

                      {/* AI integration placeholder */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-bold text-green-700">
                        <Bot size={12} />
                        AI ready
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Find an elder&apos;s account and connect your
                      information so their assistant can better
                      understand who you are.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Selected option preview */}
            {selectedAccount && (
              <div className="mt-5 rounded-2xl bg-[#fafafa] p-4">
                {selectedAccount === "elder" ? (
                  <div className="flex gap-3">
                    <Mic
                      size={21}
                      className="mt-0.5 shrink-0 text-[#ec5d6f]"
                    />

                    <div>
                      <p className="font-semibold text-[#172554]">
                        Elder setup
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Next, we&apos;ll create a simple profile and
                        introduce the voice assistant.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link2
                      size={21}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="font-semibold text-[#172554]">
                        Relative setup
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Next, you&apos;ll find your relative and add
                        approved social links for their AI assistant
                        to reference.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continue */}
          <button
            type="button"
            disabled={!selectedAccount}
            onClick={() => {
              if (selectedAccount === "relative") {
                router.push("/relative-setup");
              }

              if (selectedAccount === "elder") {
                console.log("Elder onboarding will go here");
              }
            }}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#172554] text-base font-bold text-white transition hover:bg-[#111b41] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Continue
            <ArrowRight size={19} />
          </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Proof-of-concept onboarding. No sign-in required.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
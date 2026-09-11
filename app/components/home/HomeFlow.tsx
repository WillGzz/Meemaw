"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccountType } from "./types";
import HomeHeader from "./HomeHeader";
import HomeHero from "./HomeHero";
import AccountSelection from "./AccountSelection";

export default function HomeFlow() {
  const router = useRouter();

  const [selectedAccount, setSelectedAccount] =
    useState<AccountType>(null);

  function handleContinue() {
    if (selectedAccount === "relative") {
      router.push("/relative-setup");
      return;
    }

    if (selectedAccount === "elder") {
      router.push("/elder-setup");
    }
  }

  return (
    <main className="min-h-dvh bg-[#f7f7f4] text-slate-900">
      {/* DESKTOP HEADER */}
      <HomeHeader />

      <div className="mx-auto grid min-h-dvh max-w-7xl md:min-h-[calc(100dvh-82px)] md:grid-cols-2">

        {/* HERO */}
        <HomeHero />

        {/* ONBOARDING */}
        <AccountSelection selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} handleContinue={handleContinue} />
      </div>
    </main>
  );
}

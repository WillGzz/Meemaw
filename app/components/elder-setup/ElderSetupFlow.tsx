"use client";

import { ArrowRight } from "lucide-react";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResponseStyle } from "./types";
import AboutYouStep from "./AboutYouStep";
import ConnectWorldStep from "./ConnectWorldStep";
import AssistantStep from "./AssistantStep";
import DesktopNavigation from "./DesktopNavigation";
import EndpointForStep from "./EndpointForStep";
import ElderSetupComplete from "./ElderSetupComplete";
import SetupHeader from "./SetupHeader";
import SetupSidebar from "./SetupSidebar";

export default function ElderSetupFlow() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // STEP 1
  const [name, setName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [location, setLocation] = useState("");

  // STEP 2
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [otherProfile, setOtherProfile] = useState("");

  // STEP 3
  const [assistantName, setAssistantName] = useState("Meemaw");
  const [responseStyle, setResponseStyle] =
    useState<ResponseStyle>("normal");

  const [complete, setComplete] = useState(false);

  function goBack() {
    if (step === 1) {
      router.push("/");
      return;
    }

    setStep((current) => current - 1);
  }

  function finishSetup() {
    const elderProfile = {
      profile: {
        name,
        preferredName:
          preferredName || name,
        location,
      },

      socialLinks: {
        instagram,
        facebook,
        otherProfile,
      },

      assistantPreferences: {
        assistantName,
        responseStyle,
        voiceEnabled: true,
      },
    };

    /*
      🟢 BACKEND CONNECTION

      POST /api/elder-profile

      Your backend / AI teammate can eventually
      replace this console.log with:

      await fetch("/api/elder-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(elderProfile),
      });
    */

    console.log("Elder profile:", elderProfile);

    setComplete(true);
  }

  if (complete) {
    return (
      <ElderSetupComplete name={name} preferredName={preferredName} onReturnHome={() => router.push("/")} />
    );
  }

  return (
    <main className="min-h-dvh bg-white text-slate-900 md:bg-[#f6f7f9]">

      {/* DESKTOP WEB NAV */}
      <DesktopNavigation />

      {/* MOBILE APP HEADER */}
      <SetupHeader step={step} goBack={goBack} />

      {/* RESPONSIVE PAGE */}
      <div className="mx-auto max-w-7xl md:px-8 md:py-10">

        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-10">

          {/* DESKTOP SIDEBAR */}
          <SetupSidebar step={step} goBack={goBack} />

          {/* MAIN */}
          <section className="min-h-[calc(100dvh-110px)] px-5 pb-32 pt-7 sm:px-7 md:min-h-0 md:rounded-[32px] md:border md:border-slate-200 md:bg-white md:p-10 md:shadow-sm lg:p-12">

            {step === 1 && (
              <AboutYouStep
                name={name}
                setName={setName}
                preferredName={preferredName}
                setPreferredName={setPreferredName}
                location={location}
                setLocation={setLocation}
              />
            )}

            {step === 2 && (
              <ConnectWorldStep
                instagram={instagram}
                setInstagram={setInstagram}
                facebook={facebook}
                setFacebook={setFacebook}
                otherProfile={otherProfile}
                setOtherProfile={setOtherProfile}
              />
            )}

            {step === 3 && (
              <AssistantStep
                assistantName={assistantName}
                setAssistantName={setAssistantName}
                responseStyle={responseStyle}
                setResponseStyle={setResponseStyle}
              />
            )}

            {/* DESKTOP ACTIONS */}
            <div className="mt-10 hidden items-center justify-between border-t border-slate-100 pt-7 md:flex">

              <EndpointForStep step={step} />

              {step < 3 ? (
                <button
                  type="button"
                  disabled={
                    step === 1 &&
                    (!name || !location)
                  }
                  onClick={() =>
                    setStep((current) => current + 1)
                  }
                  className="flex h-13 items-center gap-2 rounded-xl bg-[#172554] px-7 font-bold text-white disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishSetup}
                  className="flex h-13 items-center gap-2 rounded-xl bg-[#ef5d70] px-7 font-bold text-white"
                >
                  Finish setup
                  <Check size={18} />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* MOBILE APP ACTION */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white/95 px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">

        <div className="mb-2">
          <EndpointForStep step={step} />
        </div>

        {step < 3 ? (
          <button
            type="button"
            disabled={
              step === 1 &&
              (!name || !location)
            }
            onClick={() =>
              setStep((current) => current + 1)
            }
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#172554] text-base font-bold text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            Continue
            <ArrowRight size={19} />
          </button>
        ) : (
          <button
            type="button"
            onClick={finishSetup}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef5d70] text-base font-bold text-white"
          >
            Finish setup
            <Check size={19} />
          </button>
        )}
      </div>
    </main>
  );
}

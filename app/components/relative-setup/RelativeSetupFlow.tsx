"use client";

import { useMemo } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Elder } from "./types";
import { elders } from "./data";
import FindElderStep from "./FindElderStep";
import RelationshipStep from "./RelationshipStep";
import SocialStep from "./SocialStep";
import RelativeSetupComplete from "./RelativeSetupComplete";
import SetupHeader from "./SetupHeader";
import SetupSidebar from "./SetupSidebar";

export default function RelativeSetupFlow() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [search, setSearch] = useState("");
  const [selectedElder, setSelectedElder] =
    useState<Elder | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] =
    useState("");
  const [location, setLocation] = useState("");

  const [instagram, setInstagram] =
    useState("");
  const [linkedin, setLinkedin] =
    useState("");
  const [website, setWebsite] =
    useState("");

  const [finished, setFinished] =
    useState(false);

  const filteredElders = useMemo(() => {
    if (!search.trim()) {
      return elders;
    }

    return elders.filter((elder) =>
      `${elder.name} ${elder.username} ${elder.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function handleBack() {
    if (step === 1) {
      router.push("/");
      return;
    }

    setStep((current) => current - 1);
  }

  function finishSetup() {
    const relativeProfile = {
      elder: selectedElder,

      relative: {
        name,
        relationship,
        location,
      },

      socialLinks: {
        instagram,
        linkedin,
        website,
      },
    };

    /*
      🟢 ENDPOINT CONNECTION

      POST /api/relative-agents

      Your AI/backend teammate can eventually send:

      relativeProfile

      to the backend here.

      Example:

      await fetch("/api/relative-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(relativeProfile),
      });
    */

    console.log(
      "Relative profile:",
      relativeProfile
    );

    setFinished(true);
  }

  if (finished) {
    return (
      <RelativeSetupComplete name={name} selectedElder={selectedElder} relationship={relationship} onReturnHome={() => router.push("/")} />
    );
  }

  return (
    <main className="min-h-dvh bg-[#f7f7f4] text-slate-900">

      {/* NAV */}
      <SetupHeader step={step} handleBack={handleBack} />

      {/* PAGE */}
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[320px_1fr]">

        {/* DESKTOP SIDEBAR */}
        <SetupSidebar step={step} />

        {/* MAIN FORM */}
        <section className="px-5 py-7 sm:px-8 sm:py-10 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-3xl">

            {/* MOBILE PROGRESS */}
            <div className="mb-7 flex gap-2 lg:hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-2 flex-1 rounded-full ${
                    item <= step
                      ? "bg-[#ef5d70]"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <FindElderStep
                search={search}
                setSearch={setSearch}
                elders={filteredElders}
                selectedElder={selectedElder}
                setSelectedElder={setSelectedElder}
                next={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <RelationshipStep
                elder={selectedElder}
                name={name}
                setName={setName}
                relationship={relationship}
                setRelationship={setRelationship}
                location={location}
                setLocation={setLocation}
                next={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <SocialStep
                instagram={instagram}
                setInstagram={setInstagram}
                linkedin={linkedin}
                setLinkedin={setLinkedin}
                website={website}
                setWebsite={setWebsite}
                finish={finishSetup}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

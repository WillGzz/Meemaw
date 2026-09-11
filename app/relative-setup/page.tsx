"use client";

import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Bot,
  Check,
  ChevronRight,
  Globe,
  Link2,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Elder = {
  id: number;
  name: string;
  username: string;
  location: string;
  initials: string;
};

const elders: Elder[] = [
  {
    id: 1,
    name: "Ama Frempong",
    username: "@amafrempong",
    location: "Bronx, New York",
    initials: "AF",
  },
  {
    id: 2,
    name: "Kofi Mensah",
    username: "@kofimensah",
    location: "Accra, Ghana",
    initials: "KM",
  },
  {
    id: 3,
    name: "Abena Owusu",
    username: "@abenaowusu",
    location: "Brooklyn, New York",
    initials: "AO",
  },
];

export default function RelativeSetupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedElder, setSelectedElder] = useState<Elder | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [location, setLocation] = useState("");

  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  const [finished, setFinished] = useState(false);

  const filteredElders = useMemo(() => {
    if (!search.trim()) return elders;

    return elders.filter((elder) =>
      `${elder.name} ${elder.username} ${elder.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function nextStep() {
    setStep((current) => Math.min(current + 1, 3));
  }

  function previousStep() {
    if (step === 1) {
      router.back();
      return;
    }

    setStep((current) => Math.max(current - 1, 1));
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

    // ======================================================
    // AI BACKEND HOOK
    //
    // Your teammate can send relativeProfile to the backend.
    //
    // Example:
    //
    // await fetch("/api/agents/relative", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(relativeProfile),
    // });
    //
    // The AI backend can then use the approved social links
    // to build context for this relative's agent.
    // ======================================================

    console.log("Relative agent profile:", relativeProfile);

    setFinished(true);
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-[#f5f5f3] px-5 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[430px] items-center">
          <div className="w-full rounded-[32px] bg-white p-7 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check size={38} className="text-green-700" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                You&apos;re connected
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#172554]">
                Your profile is ready.
              </h1>

              <p className="mt-3 leading-7 text-gray-500">
                Meemaw can now recognize your relationship with{" "}
                <span className="font-semibold text-[#172554]">
                  {selectedElder?.name}
                </span>
                .
              </p>
            </div>

            <div className="mt-6 rounded-3xl bg-[#f6fbf8] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
                  <Bot size={23} className="text-green-700" />
                </div>

                <div>
                  <p className="font-bold text-[#172554]">
                    AI context ready
                  </p>

                  <p className="text-sm text-gray-500">
                    Approved links can now be used to build your agent context.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="mt-7 h-14 w-full rounded-full bg-[#172554] font-bold text-white"
            >
              Return home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-5 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-[430px]">
        {/* Top navigation */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={previousStep}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <p className="text-sm font-semibold text-gray-500">
            Step {step} of 3
          </p>

          <div className="h-11 w-11" />
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-2 flex-1 rounded-full ${
                item <= step ? "bg-[#ec5d6f]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#e4f6ef] via-[#edf3ff] to-[#fff1f3] px-7 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white shadow-md">
              {step === 1 && (
                <Search size={30} className="text-[#172554]" />
              )}

              {step === 2 && (
                <UsersRound size={30} className="text-[#172554]" />
              )}

              {step === 3 && (
                <Link2 size={30} className="text-[#172554]" />
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#172554]">
              {step === 1 && "Find your relative"}
              {step === 2 && "Tell us who you are"}
              {step === 3 && "Connect your profiles"}
            </h1>

            <p className="mt-2 leading-6 text-gray-600">
              {step === 1 &&
                "Search for the elder you want to stay connected with."}

              {step === 2 &&
                "Help Meemaw understand your relationship to them."}

              {step === 3 &&
                "Add approved social links that the AI can reference when helping your relative."}
            </p>
          </div>

          <div className="p-6">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="flex h-14 items-center gap-3 rounded-2xl bg-[#f5f5f5] px-4">
                  <Search size={20} className="text-gray-400" />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name or username"
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>

                <p className="mb-3 mt-6 text-sm font-semibold text-gray-500">
                  Elder accounts
                </p>

                <div className="space-y-3">
                  {filteredElders.map((elder) => (
                    <button
                      key={elder.id}
                      onClick={() => setSelectedElder(elder)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedElder?.id === elder.id
                          ? "border-[#172554] bg-[#f4f6ff]"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] text-lg font-bold text-[#172554]">
                          {elder.initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#172554]">
                            {elder.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {elder.username}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {elder.location}
                          </p>
                        </div>

                        <ChevronRight
                          size={20}
                          className="text-gray-300"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedElder}
                  onClick={nextStep}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#172554] font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Continue
                  <ArrowRight size={19} />
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                {selectedElder && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#f7f7f7] p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] font-bold text-[#172554]">
                      {selectedElder.initials}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Connecting with
                      </p>

                      <p className="font-bold text-[#172554]">
                        {selectedElder.name}
                      </p>
                    </div>
                  </div>
                )}

                <FormField
                  label="Your name"
                  placeholder="Rex Frempong"
                  value={name}
                  onChange={setName}
                />

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-600">
                    Relationship
                  </label>

                  <select
                    value={relationship}
                    onChange={(event) =>
                      setRelationship(event.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 outline-none focus:border-[#172554]"
                  >
                    <option value="">Select relationship</option>
                    <option value="Grandson">Grandson</option>
                    <option value="Granddaughter">Granddaughter</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Friend">Friend</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mt-4">
                  <FormField
                    label="Where do you live?"
                    placeholder="New York, NY"
                    value={location}
                    onChange={setLocation}
                  />
                </div>

                <button
                  disabled={!name || !relationship}
                  onClick={nextStep}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#172554] font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Continue
                  <ArrowRight size={19} />
                </button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                {/* AI integration marker */}
                <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="flex gap-3">
                    <Bot
                      size={22}
                      className="mt-0.5 shrink-0 text-green-700"
                    />

                    <div>
                      <p className="font-bold text-green-800">
                        AI connection point
                      </p>

                      <p className="mt-1 text-sm leading-5 text-green-700">
                        These links can be passed to the AI backend to
                        build context for your family agent.
                      </p>
                    </div>
                  </div>
                </div>
            <SocialField
            icon={<AtSign size={20} />}
            label="Instagram"
            placeholder="https://instagram.com/yourprofile"
            value={instagram}
            onChange={setInstagram}
            />

            <SocialField
            icon={<Globe size={20} />}
            label="LinkedIn"
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedin}
            onChange={setLinkedin}
            />

            <SocialField
            icon={<Link2 size={20} />}
            label="Website or other profile"
            placeholder="https://..."
            value={website}
            onChange={setWebsite}
            />
                <SocialField
                  icon={<Link2 size={20} />}
                  label="Website or other profile"
                  placeholder="https://..."
                  value={website}
                  onChange={setWebsite}
                />

                <div className="mt-5 rounded-2xl bg-[#fafafa] p-4">
                  <div className="flex gap-3">
                    <UserRound
                      size={21}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <p className="text-sm leading-6 text-gray-500">
                      Only add profiles you want associated with this
                      family connection. For the prototype, these links
                      are not automatically authenticated.
                    </p>
                  </div>
                </div>

                <button
                  onClick={finishSetup}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#ec5d6f] font-bold text-white transition hover:bg-[#df5062]"
                >
                  Finish setup
                  <Check size={19} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

type FormFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function FormField({
  label,
  placeholder,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 outline-none transition focus:border-[#172554]"
      />
    </div>
  );
}

type SocialFieldProps = {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function SocialField({
  icon,
  label,
  placeholder,
  value,
  onChange,
}: SocialFieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 focus-within:border-[#172554]">
        <span className="text-gray-400">{icon}</span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}
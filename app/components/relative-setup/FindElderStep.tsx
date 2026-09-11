import { MapPin } from "lucide-react";
import { Search } from "lucide-react";
import EndpointBadge from "@/app/components/EndpointBadge";
import type { Elder } from "./types";
import StepHeader from "./StepHeader";
import ContinueButton from "./ContinueButton";

export default function FindElderStep({
  search,
  setSearch,
  elders,
  selectedElder,
  setSelectedElder,
  next,
}: {
  search: string;
  setSearch: (value: string) => void;
  elders: Elder[];
  selectedElder: Elder | null;
  setSelectedElder: (elder: Elder) => void;
  next: () => void;
}) {
  return (
    <>
      <StepHeader
        icon={<Search size={28} />}
        eyebrow="Step one"
        title="Find your relative"
        description="Search for the elder account you want to connect with."
        endpoint="GET elders"
      />

      <div className="mt-8 flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
        <Search
          size={20}
          className="text-slate-400"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by name or username"
          className="w-full bg-transparent outline-none"
        />

        <EndpointBadge label="Search API" />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {elders.map((elder) => (
          <button
            type="button"
            key={elder.id}
            aria-pressed={selectedElder?.id === elder.id}
            onClick={() => setSelectedElder(elder)}
            className={`rounded-3xl border bg-white p-5 text-left transition ${
              selectedElder?.id === elder.id
                ? "border-[#172554] ring-2 ring-[#172554]/10"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] font-bold text-[#172554]">
                {elder.initials}
              </div>

              <div className="min-w-0">
                <p className="font-bold text-[#172554]">
                  {elder.name}
                </p>

                <p className="text-sm text-slate-500">
                  {elder.username}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={13} />
                  {elder.location}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <ContinueButton
        disabled={!selectedElder}
        onClick={next}
      />
    </>
  );
}

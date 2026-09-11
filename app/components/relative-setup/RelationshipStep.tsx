import { UsersRound } from "lucide-react";
import type { Elder } from "./types";
import StepHeader from "./StepHeader";
import TextField from "./TextField";
import ContinueButton from "./ContinueButton";

export default function RelationshipStep({
  elder,
  name,
  setName,
  relationship,
  setRelationship,
  location,
  setLocation,
  next,
}: {
  elder: Elder | null;
  name: string;
  setName: (value: string) => void;
  relationship: string;
  setRelationship: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  next: () => void;
}) {
  return (
    <>
      <StepHeader
        icon={<UsersRound size={28} />}
        eyebrow="Step two"
        title="Tell us who you are"
        description="This becomes part of the context that helps the elder's assistant understand your relationship."
        endpoint="Profile API"
      />

      {elder && (
        <div className="mt-7 flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] font-bold text-[#172554]">
            {elder.initials}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Connecting with
            </p>

            <p className="font-bold text-[#172554]">
              {elder.name}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <TextField
          label="Your name"
          placeholder="Rex Frempong"
          value={name}
          setValue={setName}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Relationship
          </label>

          <select
            value={relationship}
            onChange={(event) =>
              setRelationship(event.target.value)
            }
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-[#172554]"
          >
            <option value="">
              Select relationship
            </option>

            <option>Grandson</option>
            <option>Granddaughter</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Friend</option>
            <option>Sibling</option>
            <option>Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <TextField
            label="Location"
            placeholder="New York, NY"
            value={location}
            setValue={setLocation}
          />
        </div>
      </div>

      <ContinueButton
        disabled={!name || !relationship}
        onClick={next}
      />
    </>
  );
}

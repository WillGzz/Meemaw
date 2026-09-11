import { Heart } from "lucide-react";
import { MapPin } from "lucide-react";
import { UserRound } from "lucide-react";
import PageHeading from "./PageHeading";
import Input from "./Input";

export default function AboutYouStep({
  name,
  setName,
  preferredName,
  setPreferredName,
  location,
  setLocation,
}: {
  name: string;
  setName: (value: string) => void;
  preferredName: string;
  setPreferredName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}) {
  return (
    <>
      <PageHeading
        icon={<UserRound size={26} />}
        title="Tell us about you"
        description="This helps Meemaw know who it's speaking with."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <Input
          label="Your name"
          placeholder="Ama Frempong"
          value={name}
          setValue={setName}
        />

        <Input
          label="What should we call you?"
          placeholder="Grandma Ama"
          value={preferredName}
          setValue={setPreferredName}
          optional
        />

        <div className="md:col-span-2">
          <Input
            label="Where do you live?"
            placeholder="Bronx, New York"
            value={location}
            setValue={setLocation}
            icon={<MapPin size={18} />}
          />
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-[#fff5f6] p-5">
        <div className="flex gap-3">
          <Heart
            size={22}
            className="shrink-0 text-[#ef5d70]"
          />

          <div>
            <p className="font-bold text-[#172554]">
              Keep it simple
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              You won&apos;t need to remember
              usernames, menus, or complicated
              commands. Just talk naturally.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

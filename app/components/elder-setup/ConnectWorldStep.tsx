import { AtSign } from "lucide-react";
import { Bot } from "lucide-react";
import { Globe } from "lucide-react";
import { Link2 } from "lucide-react";
import EndpointDot from "@/app/components/EndpointDot";
import PageHeading from "./PageHeading";
import ProfileInput from "./ProfileInput";

export default function ConnectWorldStep({
  instagram,
  setInstagram,
  facebook,
  setFacebook,
  otherProfile,
  setOtherProfile,
}: {
  instagram: string;
  setInstagram: (value: string) => void;
  facebook: string;
  setFacebook: (value: string) => void;
  otherProfile: string;
  setOtherProfile: (value: string) => void;
}) {
  return (
    <>
      <PageHeading
        icon={<Globe size={26} />}
        title="Connect your world"
        description="Add any public profiles you'd like your assistant to know about."
      />

      <div className="mt-7 rounded-3xl border border-green-200 bg-green-50 p-5">
        <div className="flex gap-3">
          <Bot
            size={23}
            className="shrink-0 text-green-700"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-green-900">
                Social context
              </p>

              <EndpointDot label="Social context API" />
            </div>

            <p className="mt-1 text-sm leading-6 text-green-800">
              Your teammate can send these approved
              links to the AI research pipeline.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">

        <ProfileInput
          icon={<AtSign size={19} />}
          label="Instagram"
          placeholder="instagram.com/yourprofile"
          value={instagram}
          setValue={setInstagram}
        />

        <ProfileInput
          icon={<Globe size={19} />}
          label="Facebook"
          placeholder="facebook.com/yourprofile"
          value={facebook}
          setValue={setFacebook}
        />

        <ProfileInput
          icon={<Link2 size={19} />}
          label="Another public profile"
          placeholder="https://..."
          value={otherProfile}
          setValue={setOtherProfile}
        />
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-400">
        These are optional for the prototype. You can
        continue without adding anything.
      </p>
    </>
  );
}

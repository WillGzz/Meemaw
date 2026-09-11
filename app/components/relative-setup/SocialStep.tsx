import { AtSign } from "lucide-react";
import { Bot } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Globe } from "lucide-react";
import { Link2 } from "lucide-react";
import EndpointBadge from "@/app/components/EndpointBadge";
import StepHeader from "./StepHeader";
import SocialField from "./SocialField";

export default function SocialStep({
  instagram,
  setInstagram,
  linkedin,
  setLinkedin,
  website,
  setWebsite,
  finish,
}: {
  instagram: string;
  setInstagram: (value: string) => void;
  linkedin: string;
  setLinkedin: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  finish: () => void;
}) {
  return (
    <>
      <StepHeader
        icon={<Link2 size={28} />}
        eyebrow="Step three"
        title="Connect your profiles"
        description="Add public profiles that you approve Meemaw's AI to reference for context."
        endpoint="Agent context"
      />

      <div className="mt-7 rounded-3xl border border-green-200 bg-green-50 p-5">
        <div className="flex gap-4">
          <Bot
            className="mt-0.5 shrink-0 text-green-700"
            size={25}
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-green-900">
                AI integration point
              </p>

              <EndpointBadge label="POST context" />
            </div>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Your teammate can take these URLs and
              send them to the agent&apos;s research/context
              pipeline.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        <SocialField
          icon={<AtSign size={20} />}
          label="Instagram"
          placeholder="https://instagram.com/..."
          value={instagram}
          setValue={setInstagram}
        />

        <SocialField
          icon={<Globe size={20} />}
          label="LinkedIn"
          placeholder="https://linkedin.com/in/..."
          value={linkedin}
          setValue={setLinkedin}
        />

        <SocialField
          icon={<Link2 size={20} />}
          label="Website or another public profile"
          placeholder="https://..."
          value={website}
          setValue={setWebsite}
        />
      </div>

      <button
        type="button"
        onClick={finish}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#ef5d70] font-bold text-white transition hover:bg-[#df5265] md:w-auto md:px-10"
      >
        Finish setup
        <CheckCircle2 size={19} />
      </button>
    </>
  );
}

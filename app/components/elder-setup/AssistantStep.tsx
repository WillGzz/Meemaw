import { Mic } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Volume2 } from "lucide-react";
import EndpointDot from "@/app/components/EndpointDot";
import type { ResponseStyle } from "./types";
import PageHeading from "./PageHeading";
import Input from "./Input";
import PreferenceCard from "./PreferenceCard";

export default function AssistantStep({
  assistantName,
  setAssistantName,
  responseStyle,
  setResponseStyle,
}: {
  assistantName: string;
  setAssistantName: (value: string) => void;
  responseStyle: ResponseStyle;
  setResponseStyle: (value: ResponseStyle) => void;
}) {
  return (
    <>
      <PageHeading
        icon={<Sparkles size={26} />}
        title="Meet your assistant"
        description="Choose how you'd like your assistant to communicate with you."
      />

      <div className="mt-8">

        <Input
          label="What should we call your assistant?"
          placeholder="Meemaw"
          value={assistantName}
          setValue={setAssistantName}
        />

        <div className="mt-7">
          <label className="mb-3 block text-sm font-semibold text-slate-600">
            How much should it say?
          </label>

          <div className="grid gap-3 sm:grid-cols-3">

            <PreferenceCard
              title="Keep it short"
              description="Simple answers."
              selected={responseStyle === "short"}
              onClick={() =>
                setResponseStyle("short")
              }
            />

            <PreferenceCard
              title="Just right"
              description="Normal conversation."
              selected={responseStyle === "normal"}
              onClick={() =>
                setResponseStyle("normal")
              }
            />

            <PreferenceCard
              title="Tell me more"
              description="More detail."
              selected={responseStyle === "detailed"}
              onClick={() =>
                setResponseStyle("detailed")
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-[#eef1ff] p-5">
        <div className="flex gap-3">
          <Volume2
            size={23}
            className="shrink-0 text-[#172554]"
          />

          <div>
            <p className="font-bold text-[#172554]">
              Voice-first
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              On the next screen, you&apos;ll be
              able to press the red microphone and
              talk naturally.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-green-200 bg-green-50 p-5">
        <div className="flex gap-3">
          <Mic
            size={23}
            className="shrink-0 text-green-700"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-green-900">
                Voice AI
              </p>

              <EndpointDot label="Voice + Agent API" />
            </div>

            <p className="mt-1 text-sm leading-6 text-green-800">
              This preference object can be passed
              into the main agent when your teammate
              connects voice and AI.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

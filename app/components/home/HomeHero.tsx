import { Bot } from "lucide-react";
import { HeartHandshake } from "lucide-react";
import { Mic } from "lucide-react";
import { Sparkles } from "lucide-react";
import Feature from "./Feature";

export default function HomeHero() {
  return (
<section className="relative flex min-h-[320px] items-center overflow-hidden bg-gradient-to-br from-[#dff5ed] via-[#e7efff] to-[#fff1f3] px-6 py-12 sm:px-10 md:min-h-full md:px-12 lg:px-16">

          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/40 blur-3xl" />

          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[#9bd6cd]/30 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-white shadow-lg md:h-24 md:w-24">
              <HeartHandshake
                size={45}
                className="text-[#ef5d70]"
              />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#172554] backdrop-blur">
              <Sparkles size={16} className="text-[#ef5d70]" />
              AI-assisted family communication
            </div>

            <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-[#172554] sm:text-5xl lg:text-6xl">
              Stay connected without fighting with technology.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Meemaw helps older adults stay close to their
              children, grandchildren, and friends using simple
              voice conversations.
            </p>

            <div className="mt-8 hidden grid-cols-2 gap-4 lg:grid">
              <Feature
                icon={<Mic size={22} />}
                title="Talk naturally"
                text="Press a button and simply speak."
              />

              <Feature
                icon={<Bot size={22} />}
                title="AI understands"
                text="The assistant figures out who and what you mean."
              />
            </div>
          </div>
        </section>
  );
}

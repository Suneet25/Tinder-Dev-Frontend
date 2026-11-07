import { Icon } from "../common";
import { cn } from "../../lib/cn";
import { MODES } from "./content";
import Section, { LandingCard } from "./Section";

export default function Modes() {
  return (
    <Section
      id="modes"
      eyebrow="Modes"
      title="Pick what you're here for. Get a feed for each."
      intro="Turn on as many modes as you like. Each one has its own profiles, filters and icebreakers."
      className="pt-24"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        {MODES.map((mode) => (
          <LandingCard key={mode.title} className="gap-3 rounded-3xl p-5.5">
            <span className={cn("flex size-12 items-center justify-center rounded-[14px] text-ink", mode.color)}>
              <Icon name={mode.icon} size={24} strokeWidth={2.2} />
            </span>
            <h3 className="font-display text-[21px] font-bold">{mode.title}</h3>
            <p className="text-[15px] leading-[1.55] text-muted">{mode.text}</p>
          </LandingCard>
        ))}
      </div>
    </Section>
  );
}

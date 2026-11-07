import { Animation, Icon, TierBadge } from "../common";
import { THEMES } from "../../features/theme/themeSlice";
import { FEATURES } from "./content";
import Section, { LandingCard } from "./Section";


// Illustration at the top of each feature card, keyed by FEATURES[].visual
const VISUALS = {
  ring: () => (
    <div className="relative size-22">
      <Animation name="match-ring" restAt={50} className="size-22" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold">92%</span>
    </div>
  ),
  code: () => (
    <div className="rounded-[14px] border border-surface-2 bg-bg px-3.5 py-3 font-mono text-[13px] leading-[1.6] text-text-soft">
      <span className="text-subtle">// fix this bug</span>
      <br />
      <span className="text-mode-coding">const</span> page = parseInt(q.page) <span className="text-primary-hover">??</span> 1;
      <span className="ml-0.5 inline-block h-4 w-2 translate-y-[3px] bg-text motion-safe:animate-blink" />
    </div>
  ),
  chat: () => (
    <div className="flex flex-col gap-1.5">
      <span className="self-start rounded-2xl rounded-bl-md bg-border px-3 py-2 text-sm">Pair on it this weekend?</span>
      <span className="self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm font-medium text-on-primary">Saturday, 4 PM</span>
      <Animation name="typing" className="h-[30px] w-14" />
    </div>
  ),
  themes: () => (
    <div className="flex gap-2.5">
      {THEMES.map((t) => (
        <span key={t.id} title={t.name} className="size-11 rounded-xl border-2" style={{ background: t.bg, borderColor: t.primary }} />
      ))}
    </div>
  ),
  ticks: () => (
    <div className="flex gap-2.5">
      <TierBadge tier="gold" size={48} className="motion-safe:animate-float" />
      <TierBadge tier="silver" size={48} />
    </div>
  ),
  meetup: () => (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-bg px-3.5 py-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-gold-soft text-gold">
        <Icon name="calendar" size={22} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold">Build a CLI in Rust</span>
        <span className="text-[13px] text-muted">Sat · 4:00 PM · 2 hrs</span>
      </span>
    </div>
  ),
};

export default function Features() {
  return (
    <Section id="features" eyebrow="Features" title="Built for people who make plans, not small talk.">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {FEATURES.map((feature) => {
          const Visual = VISUALS[feature.visual];
          return (
            <LandingCard key={feature.title}>
              <div aria-hidden="true">
                <Visual />
              </div>
              <h3 className="font-display text-[22px] font-bold">{feature.title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted">{feature.text}</p>
            </LandingCard>
          );
        })}
      </div>
    </Section>
  );
}

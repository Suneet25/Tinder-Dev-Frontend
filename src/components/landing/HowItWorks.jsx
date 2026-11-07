import { Animation, Icon } from "../common";
import { cn } from "../../lib/cn";
import { STEPS } from "./content";
import Section from "./Section";

const MODE_DOTS = ["bg-mode-coding", "bg-mode-gym", "bg-mode-dating", "bg-mode-friends"];

// Small illustration at the top of each step card, keyed by STEPS[].visual
const VISUALS = {
  // Mode dots breathing in sequence; the first two are "picked"
  modes: () => (
    <div className="flex items-center gap-5">
      {MODE_DOTS.map((color, i) => (
        <span
          key={color}
          className={cn("flex size-9 items-center justify-center rounded-full text-ink motion-safe:animate-float", color)}
          style={{ animationDelay: `${i * 0.3}s` }}
        >
          {i < 2 && <Icon name="check" size={16} strokeWidth={3} />}
        </span>
      ))}
    </div>
  ),
  // A card tilting right with a heart popping up
  swipe: () => (
    <div className="relative h-[124px] w-[92px]">
      <span className="absolute inset-0 translate-x-2 rounded-[14px] bg-surface-2" />
      <span className="absolute inset-0 flex flex-col justify-end gap-1.5 rounded-[14px] bg-mode-coding p-3 motion-safe:animate-float">
        <span className="h-2 w-12 rounded bg-ink/50" />
        <span className="h-1.5 w-8 rounded bg-ink/35" />
      </span>
      <span className="absolute -top-3 -right-10 flex size-8 items-center justify-center rounded-full bg-primary text-on-primary">
        <Icon name="heart" size={16} />
      </span>
    </div>
  ),
  // Chat bubbles, the reply "typing" via Lottie
  chat: () => (
    <div className="flex w-[220px] flex-col gap-2.5">
      <span className="h-[34px] w-[140px] rounded-full bg-border" />
      <span className="h-[34px] w-[140px] self-end rounded-full bg-primary" />
      <Animation name="typing" className="h-[30px] w-14" />
    </div>
  ),
};

export default function HowItWorks() {
  return (
    <Section id="how" eyebrow="How it works" title="Three steps from stranger to friend.">
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {STEPS.map((step, i) => {
          const Visual = VISUALS[step.visual];
          return (
            <li key={step.title} className="flex flex-col overflow-hidden rounded-[28px] border border-border bg-surface">
              <div className="flex aspect-[5/3] items-center justify-center bg-bg/60" aria-hidden="true">
                <Visual />
              </div>
              <div className="flex flex-col gap-2 p-5.5">
                <span className="font-mono text-[13px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[22px] font-bold">{step.title}</h3>
                <p className="text-[15px] leading-[1.55] text-muted">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

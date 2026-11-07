import { Link } from "react-router-dom";
import { Animation, Icon, TierBadge } from "../common";
import { cn } from "../../lib/cn";
import { HERO_POINTS } from "./content";

// Mini Discover screen inside the phone frame
function PhoneMockup() {
  return (
    <div className="absolute top-6 left-1/2 flex h-[528px] w-[252px] -translate-x-1/2 flex-col gap-2.5 overflow-hidden rounded-[42px] border-8 border-surface-2 bg-bg px-3 pt-4.5 pb-3.5">
      <div className="flex items-center justify-between px-1">
        <span className="font-display text-[17px] font-bold">Discover</span>
        <span className="rounded-full bg-mode-coding px-2 py-1 text-[10px] font-bold text-ink">Coding</span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-[22px] border border-border bg-surface">
        <div className="flex h-[230px] items-center justify-center bg-mode-coding font-display text-7xl font-bold text-ink/50">AR</div>
        <div className="flex flex-col gap-2 p-3">
          <span className="flex items-center gap-1.5 font-display text-lg font-bold">
            Ana, 26 <TierBadge tier="gold" size={16} />
          </span>
          <span className="text-[11px] text-muted">Frontend engineer · 3 km</span>
          <span className="flex flex-wrap gap-1">
            {["React", "TypeScript"].map((t) => (
              <span key={t} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">
                {t}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-3.5">
        <span className="flex size-11 items-center justify-center rounded-full border border-border bg-surface">
          <Icon name="x" size={18} strokeWidth={2.4} />
        </span>
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="heart" size={18} />
        </span>
      </div>
    </div>
  );
}

// Bobbing pill around the phone; position it with className
function FloatingChip({ className, children }) {
  return (
    <div className={cn("absolute flex items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pr-4 pl-1.5 text-[15px] font-bold motion-safe:animate-float", className)}>
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-12 px-6 pt-16 pb-14">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
        <span className="flex items-center gap-2 self-start rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-text-soft">
          <span className="size-2 rounded-full bg-secondary motion-safe:animate-glow" aria-hidden="true" />
          One app, five ways to meet people
        </span>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1.02] font-bold tracking-[-0.04em]">
          Find your people.
          <br />
          <span className="text-primary">For code, gym</span> or more.
        </h1>
        <p className="max-w-[520px] text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-muted">
          Swipe on people by what you want to do together: a coding buddy, a gym partner, a date, new friends or someone to travel with. Become friends, then chat.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/login?mode=signup" className="flex h-14 items-center gap-2.5 rounded-2xl bg-primary px-6.5 text-base font-bold text-on-primary hover:bg-primary-hover">
            Start for free
            <Icon name="arrowRight" size={18} strokeWidth={2.4} />
          </Link>
          <a href="#how" className="flex h-14 items-center gap-2.5 rounded-2xl border border-border px-6 text-base font-semibold hover:bg-surface">
            <Icon name="play" size={18} />
            See how it works
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {HERO_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <Icon name="check" size={16} strokeWidth={2.6} className="text-secondary" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-[1_1_400px] justify-center" aria-hidden="true">
        <div className="relative h-[580px] w-full max-w-[480px]">
          {/* Orbits behind the phone, centred on it */}
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(450px,100%)] -translate-1/2 rounded-full border-[1.5px] border-dashed border-border motion-safe:animate-orbit">
            <span className="absolute top-1/2 -right-1.5 size-3 rounded-full bg-mode-coding" />
            <span className="absolute top-1/2 -left-1.5 size-2.5 rounded-full bg-mode-gym" />
          </div>
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(330px,72%)] -translate-1/2 rounded-full border-[1.5px] border-surface-2 motion-safe:animate-orbit-reverse">
            <span className="absolute -top-1.5 left-1/2 size-2.5 rounded-full bg-mode-friends" />
            <span className="absolute -bottom-1 left-1/2 size-2 rounded-full bg-mode-travel" />
          </div>

          <PhoneMockup />

          <FloatingChip className="top-[84px] left-0">
            <span className="flex size-[26px] items-center justify-center rounded-full bg-secondary/20 text-secondary">
              <Icon name="check" size={14} strokeWidth={2.6} />
            </span>
            92% match
          </FloatingChip>

          <div className="absolute top-[230px] right-0 flex flex-col rounded-[18px] bg-primary px-4.5 py-2.5 text-ink motion-safe:animate-float-slow">
            <span className="text-[11px] font-bold opacity-70">NEW FRIEND</span>
            <span className="font-display text-lg font-bold">It's a merge!</span>
          </div>

          <FloatingChip className="bottom-24 left-1.5 [animation-delay:0.8s]">
            <span className="flex size-[26px] items-center justify-center rounded-full bg-mode-gym text-ink">
              <Icon name="gym" size={14} />
            </span>
            Spotter found
          </FloatingChip>

          <Animation name="heartbeat" className="absolute right-7 bottom-15 size-16" />
        </div>
      </div>
    </section>
  );
}

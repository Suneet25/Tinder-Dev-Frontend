import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, TierBadge } from "../components/common";
import PremiumScreen from "../components/layout/PremiumScreen";
import { DEFAULT_PLAN, PLANS } from "../features/payment/plans";
import { useToast } from "../features/toast/useToast";
import { cn } from "../lib/cn";

const TONES = {
  free: "text-muted",
  silver: "text-silver",
  gold: "text-gold",
  none: "text-faint",
};

const yes = (tone) => ({ text: "✓", tone });
const no = { text: "—", tone: "none" };
const val = (text, tone) => ({ text, tone });

const COMPARE = [
  { label: "Profiles per day", free: val("50", "free"), silver: val("200", "silver"), gold: val("∞", "gold") },
  { label: "Chat with matches", free: no, silver: yes("silver"), gold: yes("gold") },
  { label: "Message before matching", free: no, silver: no, gold: yes("gold") },
  { label: "See who liked you", free: no, silver: yes("silver"), gold: yes("gold") },
  { label: "Advanced filters", free: no, silver: yes("silver"), gold: yes("gold") },
  { label: "Rewind last swipe", free: no, silver: yes("silver"), gold: yes("gold") },
  { label: "Verified tick", free: no, silver: val("Silver", "silver"), gold: val("Gold", "gold") },
  { label: "Profile boost", free: no, silver: no, gold: val("1/wk", "gold") },
  { label: "Read receipts", free: no, silver: no, gold: yes("gold") },
  { label: "No ads", free: no, silver: yes("silver"), gold: yes("gold") },
];

const GRID = "grid grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] px-3.5";

function GoldOption({ plan, active, onSelect, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-[14px] border-2 p-3 text-left transition-colors",
        active ? "border-gold bg-gold-soft" : "border-border bg-bg hover:border-border-strong",
      )}
    >
      <span className="text-xs font-semibold text-muted">{plan.duration}</span>
      <span className="font-display text-[26px] font-bold">₹{plan.price}</span>
      {children}
    </button>
  );
}

export default function Premium() {
  const notify = useToast();
  const [selected, setSelected] = useState(DEFAULT_PLAN);
  const plan = PLANS[selected];
  const silverOn = selected === "silver";
  const { silver, gold1, gold3 } = PLANS;
  const perMonth = Math.round(gold3.price / gold3.months);
  const save = Math.max(0, Math.round((1 - gold3.price / (gold1.price * gold3.months)) * 100));

  return (
    <PremiumScreen>
      <header className="flex items-center justify-between px-3 pt-3.5 pb-1.5">
        <IconButton as={Link} to="/profile" icon="x" label="Close" variant="ghost" iconSize={22} />
        <button
          type="button"
          onClick={() => notify.info("Restoring purchases isn't available yet.")}
          className="p-3 text-[13px] font-semibold text-muted hover:text-text"
        >
          Restore purchase
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-5 pb-5">
        <section className="flex flex-col gap-2.5">
          <div className="flex gap-1.5">
            <TierBadge tier="silver" size={34} />
            <TierBadge tier="gold" size={34} />
          </div>
          <h1 className="m-0 font-display text-[32px] leading-[1.08] font-bold tracking-[-0.03em]">Meet more people. Chat without limits.</h1>
          <p className="text-sm leading-normal text-muted">You're on the Free plan: 50 profiles a day and chat is locked.</p>
        </section>

        <section aria-label="Choose a plan" className="flex flex-col gap-3">
          <button
            type="button"
            aria-pressed={silverOn}
            onClick={() => setSelected("silver")}
            className={cn(
              "relative flex w-full flex-col items-start gap-1.5 rounded-[20px] border-2 bg-surface p-4 text-left transition-colors",
              silverOn ? "border-silver-muted" : "border-border hover:border-border-strong",
            )}
          >
            <span className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2 font-display text-xl font-bold text-silver">
                <TierBadge tier="silver" />
                Silver
              </span>
              <span className={cn("flex size-[22px] items-center justify-center rounded-full border-2", silverOn ? "border-silver-muted" : "border-border-strong")}>
                <span className={cn("size-2.5 rounded-full", silverOn && "bg-silver-muted")} />
              </span>
            </span>
            <span className="flex items-baseline gap-1">
              <span className="font-display text-[28px] font-bold">₹{silver.price}</span>
              <span className="text-[13px] text-muted">/ month</span>
            </span>
            <span className="text-[13px] leading-normal text-muted">200 profiles a day, chat with your matches, see who liked you.</span>
          </button>

          <div
            className={cn(
              "relative flex flex-col gap-2.5 rounded-[20px] border-2 bg-surface px-4 pt-[18px] pb-4 transition-colors",
              silverOn ? "border-border" : "border-gold",
            )}
          >
            <span className="absolute -top-[11px] right-4 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-ink">MOST POPULAR</span>
            <span className="flex items-center gap-2 font-display text-xl font-bold text-gold">
              <TierBadge tier="gold" />
              Gold
            </span>
            <span className="text-[13px] leading-normal text-muted">Unlimited profiles, message anyone before matching, gold tick and a weekly boost.</span>
            <div className="grid grid-cols-2 gap-2.5">
              <GoldOption plan={gold1} active={selected === "gold1"} onSelect={() => setSelected("gold1")}>
                <span className="text-xs text-muted">₹{gold1.price} / month</span>
              </GoldOption>
              <GoldOption plan={gold3} active={selected === "gold3"} onSelect={() => setSelected("gold3")}>
                <span className="text-xs font-semibold text-gold">
                  ₹{perMonth} / month · save {save}%
                </span>
              </GoldOption>
            </div>
          </div>
        </section>

        <section aria-label="Compare plans" className="overflow-hidden rounded-[20px] border border-border bg-surface">
          <div className={cn(GRID, "border-b border-border py-3 text-xs font-bold")}>
            <span className="text-muted">Feature</span>
            <span className="text-center text-muted">Free</span>
            <span className="text-center text-silver">Silver</span>
            <span className="text-center text-gold">Gold</span>
          </div>
          {COMPARE.map((row) => (
            <div key={row.label} className={cn(GRID, "items-center border-b border-surface-2 py-[11px] text-[13px] last:border-b-0")}>
              <span className="leading-[1.35]">{row.label}</span>
              {[row.free, row.silver, row.gold].map((cell, i) => (
                <span key={i} className={cn("text-center font-semibold", TONES[cell.tone])}>
                  {cell.text}
                </span>
              ))}
            </div>
          ))}
        </section>

        <p className="text-center text-xs leading-[1.55] text-muted">Renews automatically. Cancel anytime from Profile › Subscription. Prices include GST.</p>
      </main>

      <div className="flex flex-col gap-2 border-t border-surface-2 bg-bg px-5 pt-3 pb-[26px]">
        <Link
          to={`/premium/checkout?plan=${plan.id}`}
          className={cn("flex h-[54px] items-center justify-center gap-2 rounded-[14px] text-base font-bold text-ink", silverOn ? "bg-silver" : "bg-gold")}
        >
          Continue with {plan.name} · {plan.duration} · ₹{plan.price}
        </Link>
      </div>
    </PremiumScreen>
  );
}

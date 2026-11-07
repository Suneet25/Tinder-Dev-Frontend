import { Link } from "react-router-dom";
import { Icon, TierBadge } from "../common";
import { PLANS } from "../../features/payment/plans";
import { cn } from "../../lib/cn";
import Section from "./Section";

// Prices come from features/payment/plans.js so they always match checkout
const TIERS = [
  {
    name: "Free",
    price: 0,
    perks: ["50 profiles a day", "All five modes", "Send friend requests"],
    cta: "Start free",
    card: "border border-border bg-surface",
    check: "text-muted",
    button: "border border-border hover:bg-surface-2",
  },
  {
    name: "Silver",
    tier: "silver",
    price: PLANS.silver.price,
    perks: ["200 profiles a day", "Chat with friends", "See who liked you", "Silver tick"],
    cta: "Get Silver",
    card: "border-2 border-border-strong bg-surface",
    title: "text-silver",
    check: "text-silver",
    button: "bg-silver font-bold text-ink hover:opacity-90",
  },
  {
    name: "Gold",
    tier: "gold",
    price: PLANS.gold1.price,
    note: `or ₹${PLANS.gold3.price} for 3 months`,
    popular: true,
    perks: ["Unlimited profiles", "Message before matching", "Weekly profile boost", "Gold tick and read receipts"],
    cta: "Get Gold",
    card: "border-2 border-gold bg-gold-soft/50",
    title: "text-gold",
    check: "text-gold",
    button: "bg-gold font-bold text-ink hover:opacity-90",
  },
];

export default function Pricing() {
  return (
    <Section id="pricing" eyebrow="Pricing" title="Start free. Upgrade when you want more." intro="Prices include GST. Cancel anytime. Payments by Razorpay." centered>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch gap-4">
        {TIERS.map((t) => (
          <article key={t.name} className={cn("relative flex flex-col gap-4.5 rounded-[28px] p-7", t.card)}>
            {t.popular && (
              <span className="absolute -top-3.5 left-7 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-[0.04em] text-ink">MOST POPULAR</span>
            )}
            <h3 className={cn("flex items-center gap-2 font-display text-[22px] font-bold", t.title)}>
              {t.tier && <TierBadge tier={t.tier} size={24} />}
              {t.name}
            </h3>
            <span className="flex flex-col gap-1">
              <span className="font-display text-[44px] font-bold tracking-[-0.03em]">
                ₹{t.price}
                {t.price > 0 && <span className="font-sans text-base font-medium tracking-normal text-muted"> / month</span>}
              </span>
              {t.note && <span className="text-sm font-semibold text-gold">{t.note}</span>}
            </span>
            <ul className="flex flex-1 flex-col gap-2.5 text-[15px] text-text-soft">
              {t.perks.map((perk) => (
                <li key={perk} className="flex gap-2.5">
                  <Icon name="check" size={18} strokeWidth={2.6} className={cn("shrink-0", t.check)} />
                  {perk}
                </li>
              ))}
            </ul>
            <Link to="/login?mode=signup" className={cn("flex h-13 items-center justify-center rounded-[14px] text-[15px] font-semibold", t.button)}>
              {t.cta}
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

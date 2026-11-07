import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Animation, Avatar, Icon, TierBadge } from "../components/common";
import PremiumScreen from "../components/layout/PremiumScreen";
import { PLANS, renewalDate, TIERS } from "../features/payment/plans";
import { checkPremium } from "../features/premium/premiumSlice";
import { cn } from "../lib/cn";

const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 10;

// [left, top, width, height, rotate, color]; "tier" takes the plan's color
const CONFETTI = [
  [34, 70, 10, 18, -24, "tier"],
  [96, 34, 8, 8, 0, "bg-primary", true],
  [300, 52, 10, 18, 32, "bg-mode-coding"],
  [344, 132, 8, 8, 0, "tier", true],
  [22, 190, 8, 14, 18, "bg-secondary"],
  [246, 26, 6, 6, 0, "bg-secondary", true],
  [330, 236, 10, 16, -40, "bg-primary"],
  [150, 18, 9, 15, 50, "tier"],
];

function Row({ label, children }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      {children}
    </div>
  );
}

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.data);
  const isPremium = useSelector((s) => s.premium.isPremium);
  const { state } = useLocation();
  const plan = PLANS[state?.planId];

  // The membership is granted by Razorpay's webhook, which can land a few
  // seconds after the checkout closes: re-check until the backend has it.
  useEffect(() => {
    if (!plan || isPremium) return;
    let attempts = 0;
    dispatch(checkPremium());
    const timer = setInterval(() => {
      if (++attempts >= POLL_ATTEMPTS) clearInterval(timer);
      dispatch(checkPremium());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [dispatch, plan, isPremium]);

  // Only reachable straight after a Razorpay payment
  if (!plan) return <Navigate to="/premium" replace />;

  const tier = TIERS[plan.tier];

  return (
    <PremiumScreen>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {CONFETTI.map(([left, top, width, height, rotate, color, round], i) => (
          <span
            key={i}
            className={cn("absolute", round ? "rounded-full" : "rounded-[2px]", color === "tier" ? tier.bg : color)}
            style={{ left, top, width, height, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
          />
        ))}
      </div>

      <main className="relative flex min-h-0 flex-1 flex-col items-center gap-[18px] overflow-y-auto px-5 pt-14 pb-4 text-center">
        <div className="relative flex shrink-0 items-center justify-center">
          <Animation name="success-burst" loop={false} className="absolute size-[220px]" />
          <div className={cn("relative flex size-[132px] items-center justify-center rounded-full", tier.glow)}>
            <TierBadge tier={plan.tier} size={96} label={`${plan.name} tick`} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-secondary">Payment successful</span>
          <h1 className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.03em]">
            Thank you, {user.firstName}!
            <br />
            Welcome to {plan.name}.
          </h1>
          <p className="text-[15px] leading-normal text-muted">Your {plan.tier} tick is live. Everyone you swipe on can see it now.</p>
        </div>

        <div className={cn("flex w-full items-center gap-3 rounded-[18px] border bg-surface px-3.5 py-3 text-left", tier.border)}>
          <Avatar user={user} size="md" />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-base font-bold">
              {user.firstName}
              {user.age ? `, ${user.age}` : ""}
              <TierBadge tier={plan.tier} size={18} />
            </span>
            <span className={cn("text-[13px] font-semibold", tier.text)}>{plan.name} member · how others see you</span>
          </span>
        </div>

        <section aria-label="Receipt" className="flex w-full flex-col gap-[9px] rounded-[18px] border border-border bg-surface px-4 py-3.5 text-left text-sm">
          <Row label="Plan">
            <span className="font-semibold">
              {plan.name} · {plan.duration}
            </span>
          </Row>
          <Row label="Amount paid">
            <span className="font-semibold">₹{state.amount ?? plan.price}</span>
          </Row>
          <Row label="Valid till">
            <span className="font-semibold">{renewalDate(plan)}</span>
          </Row>
          <Row label="Payment ID">
            <span className="font-mono text-xs text-text-soft">{state.paymentId}</span>
          </Row>
        </section>

        <section aria-label="Now unlocked" className="grid w-full grid-cols-2 gap-2 text-left">
          {tier.unlocked.map((perk) => (
            <div key={perk} className="flex flex-col gap-1.5 rounded-[14px] border border-border bg-surface p-3">
              <Icon name="check" size={18} strokeWidth={2.6} className={tier.text} />
              <span className="text-[13px] leading-[1.35] font-semibold">{perk}</span>
            </div>
          ))}
        </section>
      </main>

      <div className="relative flex flex-col gap-2.5 bg-bg px-5 pt-3 pb-[26px]">
        <Link to="/chats" className={cn("flex h-[54px] items-center justify-center rounded-[14px] text-base font-bold text-ink", tier.bg)}>
          Start chatting
        </Link>
        <Link to="/feed" className="flex h-[50px] items-center justify-center rounded-[14px] border border-border text-[15px] font-semibold hover:bg-surface">
          Back to Discover
        </Link>
      </div>
    </PremiumScreen>
  );
}

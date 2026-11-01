import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon, IconButton, Spinner, TierBadge } from "../components/common";
import PremiumScreen from "../components/layout/PremiumScreen";
import { DEFAULT_PLAN, PLANS, renewalDate, TIERS } from "../features/payment/plans";
import { useToast } from "../features/toast/useToast";
import { api, getErrorMessage } from "../lib/api";
import { fullName } from "../lib/avatar";
import { cn } from "../lib/cn";
import { loadRazorpay, openRazorpay } from "../lib/razorpay";

export default function Checkout() {
  const navigate = useNavigate();
  const notify = useToast();
  const user = useSelector((s) => s.user.data);
  const [params] = useSearchParams();
  const plan = PLANS[params.get("plan")] ?? PLANS[DEFAULT_PLAN];
  const tier = TIERS[plan.tier];
  const [paying, setPaying] = useState(false);

  async function pay() {
    setPaying(true);
    let order;
    try {
      // POST /payment/create -> saved Payment ({ orderId, amount, currency, ... }) plus keyId
      [{ data: order }] = await Promise.all([api.post("/payment/create", { membershipType: plan.membershipType }), loadRazorpay()]);
    } catch (error) {
      notify.error(getErrorMessage(error, "Couldn't start the payment. Please try again."));
      setPaying(false);
      return;
    }

    openRazorpay({
      order,
      description: `${plan.name} · ${plan.duration}`,
      prefill: { name: fullName(user), email: user.emailId },
      color: tier.hex,
      onSuccess: (response) =>
        navigate("/premium/success", {
          replace: true,
          state: { planId: plan.id, paymentId: response.razorpay_payment_id, amount: order.amount / 100 },
        }),
      onFailure: (message) => notify.error(message),
      onDismiss: () => setPaying(false),
    });
  }

  return (
    <PremiumScreen>
      <header className="flex items-center gap-2 border-b border-surface-2 px-3 pt-3.5 pb-3">
        <IconButton as={Link} to="/premium" icon="back" label="Back to plans" variant="ghost" iconSize={22} />
        <h1 className="flex-1 font-display text-xl font-bold">Checkout</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-1.5 text-xs font-semibold text-secondary">
          <Icon name="lock" size={14} strokeWidth={2.2} />
          Secure
        </span>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-[18px] pb-5">
        <section aria-label="Order summary" className={cn("flex flex-col gap-3.5 rounded-[20px] border bg-surface px-4 py-[18px]", tier.border)}>
          <div className="flex items-center gap-3">
            <TierBadge tier={plan.tier} size={44} />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-display text-xl font-bold">
                {plan.name} · {plan.duration}
              </span>
              <span className="text-[13px] text-muted">Renews {renewalDate(plan)} · cancel anytime</span>
            </div>
            <Link to="/premium" className="py-3 pl-2 text-[13px] font-semibold text-primary-hover hover:text-primary">
              Change
            </Link>
          </div>

          <ul className="flex flex-col gap-[9px] border-t border-dashed border-border pt-3.5">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm">
                <Icon name="check" size={16} strokeWidth={2.6} className={tier.text} />
                {perk}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Price" className="flex flex-col gap-2.5 rounded-[20px] border border-border bg-surface p-4 text-sm">
          <div className="flex gap-2">
            <label className="flex flex-1">
              <span className="sr-only">Promo code</span>
              <input
                type="text"
                placeholder="Promo code"
                className="h-11 w-full rounded-control border border-border bg-bg px-3 font-mono text-sm uppercase text-text outline-none focus:border-border-strong"
              />
            </label>
            <button
              type="button"
              onClick={() => notify.info("Promo codes aren't available yet.")}
              className="h-11 rounded-control border border-border bg-surface-2 px-4 text-sm font-semibold hover:bg-border"
            >
              Apply
            </button>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted">Plan price</span>
            <span>₹{plan.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Promo</span>
            <span className="text-secondary">None</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-2.5">
            <span className="text-base font-bold">
              Total <span className="text-xs font-medium text-muted">incl. GST</span>
            </span>
            <span className="font-display text-[26px] font-bold">₹{plan.price}</span>
          </div>
        </section>
      </main>

      <div className="flex flex-col gap-2.5 border-t border-surface-2 px-4 pt-3.5 pb-[26px]">
        <button
          type="button"
          onClick={pay}
          disabled={paying}
          aria-busy={paying || undefined}
          className={cn("flex h-14 items-center justify-center gap-2 rounded-[14px] text-base font-bold text-ink disabled:opacity-70", tier.bg)}
        >
          {paying ? <Spinner size={18} label="" /> : <Icon name="lock" size={18} strokeWidth={2.2} />}
          Pay ₹{plan.price} securely
        </button>
        <p className="text-center text-xs leading-normal text-muted">Secured by Razorpay · UPI, cards, net banking and wallets</p>
      </div>
    </PremiumScreen>
  );
}

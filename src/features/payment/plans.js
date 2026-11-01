// Plans shown on the Premium screen. `membershipType` is what POST
// /payment/create expects; the backend's membershipPackage sets the amount
// actually charged.
export const PLANS = {
  silver: { id: "silver", tier: "silver", membershipType: "Silver", name: "Silver", duration: "1 month", months: 1, price: 299 },
  gold1: { id: "gold1", tier: "gold", membershipType: "Gold", name: "Gold", duration: "1 month", months: 1, price: 500 },
  gold3: { id: "gold3", tier: "gold", membershipType: "Gold", name: "Gold", duration: "3 months", months: 3, price: 700 },
};

export const DEFAULT_PLAN = "gold3";

export const TIERS = {
  silver: {
    hex: "#DDE1E8",
    text: "text-silver",
    bg: "bg-silver",
    border: "border-border-strong",
    glow: "bg-surface-2",
    perks: ["200 profiles every day", "Chat with your matches", "Silver tick on your profile", "See who liked you"],
    unlocked: ["200 profiles a day", "Chat with matches", "See who liked you", "No ads"],
  },
  gold: {
    hex: "#F5C451",
    text: "text-gold",
    bg: "bg-gold",
    border: "border-gold-border",
    glow: "bg-gold-soft",
    perks: ["Unlimited profiles every day", "Message anyone before matching", "Gold tick on your profile", "1 profile boost every week"],
    unlocked: ["Unlimited profiles", "Message anyone", "See who liked you", "Weekly boost"],
  },
};

// "1 Feb 2027": when a plan bought today renews
export function renewalDate(plan, from = new Date()) {
  const date = new Date(from);
  date.setMonth(date.getMonth() + plan.months);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

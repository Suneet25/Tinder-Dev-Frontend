const FILLS = ["#FF9B7A", "#7FD8CC", "#C7B4FF", "#6FA8FF", "#F5C451", "#C6F432", "#FF8A6E"];

export function initials(user) {
  const first = user?.firstName?.[0] ?? "";
  const last = user?.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

export function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
}

// Stable color per user so the same person always gets the same avatar.
export function avatarFill(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return FILLS[Math.abs(hash) % FILLS.length];
}

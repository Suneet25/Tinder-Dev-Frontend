// Main navigation, shared by the mobile tab bar and the desktop sidebar.
// `match` lists extra path prefixes that count as this tab (a chat thread
// lives under /chat/:id but belongs to Chats).
export const NAV_ITEMS = [
  { to: "/feed", label: "Discover", icon: "compass" },
  { to: "/requests", label: "Requests", icon: "inbox", badge: "requests" },
  { to: "/chats", label: "Chats", icon: "chat", match: ["/chat/"] },
  { to: "/profile", label: "Profile", icon: "user", match: ["/profile/"] },
];

// Desktop only: on mobile Appearance is reached from Profile
export const SIDEBAR_EXTRA_ITEMS = [{ to: "/appearance", label: "Appearance", icon: "palette" }];

export function isNavActive(item, pathname) {
  return pathname === item.to || (item.match ?? []).some((prefix) => pathname.startsWith(prefix));
}

// Mobile screens that take the whole viewport, without the tab bar
const IMMERSIVE_ROUTES = [/^\/chat\//, /^\/user\//, /^\/profile\/edit/, /^\/appearance/];
export const isImmersiveRoute = (pathname) => IMMERSIVE_ROUTES.some((re) => re.test(pathname));

// Desktop screens that collapse the sidebar to an icon rail for more room
const COMPACT_ROUTES = [/^\/chats?(\/|$)/];
export const isCompactRoute = (pathname) => COMPACT_ROUTES.some((re) => re.test(pathname));

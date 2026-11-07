// Copy for the landing page. Edit text here; the section components only lay it out.

export const SECTION_LINKS = [
  { href: "#modes", label: "Modes" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const HERO_POINTS = ["Free plan, no card needed", "Chat only with friends", "Verified profiles"];

// `color` is a Tailwind bg-* class from the mode palette in index.css
export const MODES = [
  { title: "Coding buddy", icon: "code", color: "bg-mode-coding", text: "Match on stack, send a code icebreaker, plan a pair-programming session." },
  { title: "Gym partner", icon: "gym", color: "bg-mode-gym", text: "Find a spotter near your gym who trains at the same time you do." },
  { title: "Dating", icon: "heart", color: "bg-mode-dating", text: "Photo-verified profiles and prompts that start real conversations." },
  { title: "Friends", icon: "users", color: "bg-mode-friends", text: "New in town? Find people for board games, brunch and weekend plans." },
  { title: "Travel buddy", icon: "plane", color: "bg-mode-travel", text: "Share the road trip, split the hostel, plan the trek together." },
];

// Scrolling strip under the hero
export const MARQUEE = [
  { label: "Coding buddy", color: "bg-mode-coding" },
  { label: "Gym partner", color: "bg-mode-gym" },
  { label: "Dating", color: "bg-mode-dating" },
  { label: "Friends", color: "bg-mode-friends" },
  { label: "Travel buddy", color: "bg-mode-travel" },
  { label: "Co-founder", color: "bg-mode-cofounder" },
  { label: "Hackathon team", color: "bg-mode-coding" },
  { label: "Running crew", color: "bg-mode-gym" },
];

// `visual` picks the illustration in HowItWorks.jsx
export const STEPS = [
  { visual: "modes", title: "Pick your modes", text: "Coding, gym, dating, friends or travel. Choose any mix." },
  { visual: "swipe", title: "Swipe on people who fit", text: "Every card shows shared interests and a prompt to break the ice." },
  { visual: "chat", title: "Become friends, then chat", text: "Chat opens only when you've both said yes. No cold DMs." },
];

// `visual` picks the illustration in Features.jsx
export const FEATURES = [
  { visual: "ring", title: "Compatibility score", text: "Shared skills, interests, schedule and distance, rolled into one number on every card." },
  { visual: "code", title: "Icebreakers that fit the mode", text: "A bug to fix for coders, a workout invite for the gym, a note for dates." },
  { visual: "chat", title: "Friends-only chat", text: "Messages open once you're both in, so every conversation is wanted." },
  { visual: "themes", title: "Themes for every mood", text: "Midnight, Paper, Editor Dark, Iron and Blush. Pick the one that feels like you." },
  { visual: "ticks", title: "Gold and silver ticks", text: "Members stand out in the feed and in chat, so people know you're serious." },
  { visual: "meetup", title: "Plan the meetup in chat", text: "Propose a time and a plan. They can accept or reschedule in one tap." },
];

export const FAQ = [
  {
    q: "Is Tinder-Dev only for developers?",
    a: "No. It started with coders, but you can use it to find gym partners, dates, friends and travel buddies too. Pick any mix of modes.",
  },
  {
    q: "Who can I chat with?",
    a: "Only your friends. Chat opens after you send a request and the other person accepts it.",
  },
  {
    q: "What do the gold and silver ticks mean?",
    a: "They show that someone is a Gold or Silver member. You'll see them next to names on profiles and in chat.",
  },
  {
    q: "How do payments work?",
    a: "Payments go through Razorpay, so you can pay with UPI, cards, net banking or wallets. Plans renew automatically and you can cancel anytime.",
  },
  {
    q: "Can I change how the app looks?",
    a: "Yes. Choose from five themes in Appearance: Midnight, Paper, Editor Dark, Iron and Blush.",
  },
];

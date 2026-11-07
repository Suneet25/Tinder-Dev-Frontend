# Tinder-Dev Frontend

React + Redux Toolkit + Tailwind CSS v4 client for [Tinder-Dev-Backend](../Tinder-Dev-Backend).

## Run

```bash
cp .env.example .env     # optional, defaults to http://localhost:7777
npm install
npm run dev              # http://localhost:5173
```

Start the backend first (`npm run dev` in Tinder-Dev-Backend). In development every request goes to `/api/*` and Vite proxies it to the backend, so the `token` cookie is same-origin and no CORS setup is needed.

## Deploy

The app always calls `/api/*`. Whatever serves the build must forward that prefix to the backend, which keeps the cookie same-origin exactly as in development:

| Where | Who forwards `/api` | Config |
| --- | --- | --- |
| `npm run dev` | Vite dev server | `VITE_BACKEND_URL` (default `http://localhost:7777`) |
| `npm run build && npm run preview` | Vite preview server | same |
| Production | nginx | below |

```nginx
server {
    server_name your-domain.com;
    root /var/www/tinder-dev-frontend/dist;

    # React Router: unknown paths load the app
    location / {
        try_files $uri /index.html;
    }

    # /api/login -> http://localhost:7777/login
    location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Build with `npm run build` (no env needed) and copy `dist/` to the `root` above. The trailing `/` on both `location /api/` and `proxy_pass` is what strips the prefix.

Backend on a different domain instead? Build with `VITE_API_URL=https://api.example.com npm run build`, and on the backend allow that origin in `cors({ origin, credentials: true })` (registered before the routers) and set the cookie with `sameSite: "none", secure: true`.

## Structure

```
src/
  app/store.js              Redux store (resets user data on logout)
  lib/                      api (axios + error messages), avatar, time formatting, cn
  hooks/useMediaQuery.js    for the few places desktop and mobile render different trees
  features/
    user/                   session: login, signup, logout, profile view/edit
    feed/                   GET /feed, POST /request/send/:status/:id
    requests/               GET /user/requests/received, POST /request/review/:status/:id
    connections/            GET /user/connections, useFriend(userId)
    chat/                   chat threads (in memory until the backend has a chat API)
    premium/, payment/      GET /payment/check-premium, plans and prices
    toast/                  toast slice + useToast() hook
    theme/                  theme slice (persisted in localStorage)
  components/
    common/                 Button, IconButton, Input, Avatar, Icon, Logo, TierBadge,
                            Animation (Lottie), Toaster, ...
    layout/                 AppLayout, SideNav (desktop), BottomNav (mobile),
                            navigation.js (nav items, full-screen routes), route guards
    chat/                   ChatList, Conversation, ChatInfo
    feed/                   ActivityPanel (desktop Discover sidebar)
    landing/                landing page sections; copy lives in content.js
  pages/                    one file per route (see App.jsx)
  assets/lottie/            generated animations (see below)
scripts/build-lottie.mjs    source of the Lottie animations
```

## Layout: mobile and desktop

Below Tailwind's `lg` breakpoint (1024px) the app is a phone-width column with a tab bar. From `lg` up, `AppLayout` shows a sidebar instead and each page uses the full width (`lg:` classes). Chats collapses the sidebar to an icon rail and shows list, conversation and info side by side. Which routes hide the tab bar or collapse the sidebar is configured in `components/layout/navigation.js`.

## Animations

- **Lottie** for self-contained illustrations: `<Animation name="typing" className="h-[30px] w-14" />`. The player and the JSON load lazily, so pages without animations don't download them. With *reduce motion* turned on they show a still frame.
- **CSS** (`animate-float`, `animate-orbit`, `animate-marquee`, ... in `index.css`) for simple movement. Always prefix them with `motion-safe:`.

The Lottie files are generated from `scripts/build-lottie.mjs`. To change one or add one, edit that file, run `npm run lottie`, commit the JSON it writes and add the name to the map in `components/common/Animation.jsx`. You can also drop in a JSON exported from LottieFiles/After Effects and register it the same way.

## Colors and themes

All colors are CSS variables in `src/index.css`, mapped to Tailwind utilities. Use the token, never a hex:

| Token | Utility examples | Used for |
| --- | --- | --- |
| `primary` / `on-primary` | `bg-primary text-on-primary` | Main CTAs, active tab, focus ring |
| `secondary` / `on-secondary` | `bg-secondary`, `text-secondary` | Success, verified, positive stats |
| `bg`, `surface`, `surface-2` | `bg-surface` | Page, cards, raised fills |
| `border`, `border-strong` | `border-border` | Dividers, inputs |
| `text`, `text-soft`, `muted`, `subtle` | `text-muted` | Text hierarchy |
| `danger`, `warning`, `info` | `text-danger` | Errors, toasts |
| `rounded-card` / `rounded-control` / `rounded-action` | | Per-theme radii |
| `font-display`, `heading` utility | | Per-theme display type |

Themes (Midnight, Paper, Editor Dark, Iron, Blush) switch by setting `data-theme` on `<html>`; pick one under Profile → Appearance.

## Toasts

```js
// In components
const notify = useToast();
notify.success("Saved");   // .error .info .warning, optional { title, duration }

// In thunks
dispatch(toast.error(getErrorMessage(err)));
```

Toasts auto-dismiss (errors stay longest), pause on hover/focus, de-duplicate identical messages, cap at four, and are announced to screen readers. Every API thunk already toasts its own errors using the server's message.

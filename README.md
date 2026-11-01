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
  lib/api.js                axios instance, error-message normalizer, 401 handling
  features/
    user/                   session: login, signup, logout, profile view/edit
    feed/                   GET /feed, POST /request/send/:status/:id
    requests/               GET /user/requests/received, POST /request/review/:status/:id
    connections/            GET /user/connections
    toast/                  toast slice + useToast() hook
    theme/                  theme slice (persisted in localStorage)
  components/
    common/                 Button, IconButton, Input, Select, Textarea, Tag, Badge,
                            ChoiceChip, Avatar, Card, SegmentedControl, EmptyState,
                            Spinner, Icon, Toaster
    layout/                 AppLayout, BottomNav, PageHeader, route guards
  pages/                    Login, Feed, Requests, Connections, Profile, EditProfile, Appearance
```

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

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Button, IconButton, SectionLabel, Tag } from "../components/common";
import { setTheme, THEMES } from "../features/theme/themeSlice";
import { useToast } from "../features/toast/useToast";
import { cn } from "../lib/cn";

export default function Appearance() {
  const dispatch = useDispatch();
  const notify = useToast();
  const current = useSelector((s) => s.theme.current);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg lg:max-w-2xl lg:py-4">
      <header className="flex items-center gap-2 border-b border-border px-3 py-3">
        <IconButton as={Link} to="/profile" icon="back" label="Back to profile" variant="ghost" />
        <h1 className="heading flex-1 text-xl">Appearance</h1>
        <Button variant="outline" size="sm" onClick={() => dispatch(setTheme("midnight"))}>
          Reset
        </Button>
      </header>

      <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
        <section aria-label="Live preview" className="flex flex-col gap-3 rounded-card bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <span className="heading text-lg">Preview</span>
            <Badge tone="secondary">Verified</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Tag>React</Tag>
            <Tag>Node.js</Tag>
            <Tag>Gym</Tag>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel as="h2">Theme</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {THEMES.map((t) => {
              const active = t.id === current;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch(setTheme(t.id))}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-[14px] border-2 bg-surface p-2 pb-2.5 text-left transition-colors",
                    active ? "border-primary" : "border-border hover:border-border-strong",
                  )}
                >
                  <span className="relative mb-1 block h-16 w-full overflow-hidden rounded-lg border border-black/10" style={{ background: t.bg }}>
                    <span className="absolute top-2.5 right-8 left-2 h-2 rounded" style={{ background: t.surface }} />
                    <span className="absolute top-2 right-2 size-3.5 rounded-full" style={{ background: t.primary }} />
                    <span className="absolute bottom-1.5 left-2 text-xl font-bold leading-none" style={{ color: t.text }}>
                      Aa
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-xs text-muted">{t.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel as="h2">Notifications</SectionLabel>
          <p className="text-sm text-muted">See how toasts look in this theme.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="soft" onClick={() => notify.success("Request sent to Riya.")}>
              Success
            </Button>
            <Button variant="soft" onClick={() => notify.error("Invalid credentials!")}>
              Error
            </Button>
            <Button variant="soft" onClick={() => notify.info("You've been logged out.")}>
              Info
            </Button>
            <Button variant="soft" onClick={() => notify.warning("Your session expired. Please log in again.")}>
              Warning
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

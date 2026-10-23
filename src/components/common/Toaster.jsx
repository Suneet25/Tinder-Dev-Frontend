import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissToast } from "../../features/toast/toastSlice";
import { cn } from "../../lib/cn";
import Icon from "./Icon";

const TYPES = {
  success: { icon: "checkCircle", tone: "text-secondary", bar: "bg-secondary", role: "status" },
  info: { icon: "info", tone: "text-info", bar: "bg-info", role: "status" },
  warning: { icon: "alert", tone: "text-warning", bar: "bg-warning", role: "status" },
  error: { icon: "errorCircle", tone: "text-danger", bar: "bg-danger", role: "alert" },
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);
  const meta = TYPES[toast.type] ?? TYPES.info;

  // Auto-dismiss, pausing while hovered or focused so it can be read
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, dispatch, toast.id]);

  return (
    <li
      role={meta.role}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto relative flex w-full animate-toast-in items-start gap-3 overflow-hidden rounded-[16px] border border-border bg-surface p-3.5 pr-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)]"
    >
      <span className={cn("mt-0.5 shrink-0", meta.tone)}>
        <Icon name={meta.icon} size={20} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        {toast.title && <p className="text-sm font-semibold text-text">{toast.title}</p>}
        <p className={cn("text-sm leading-snug", toast.title ? "text-muted" : "text-text")}>{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dispatch(dismissToast(toast.id))}
        aria-label="Dismiss notification"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-muted hover:bg-surface-2 hover:text-text"
      >
        <Icon name="x" size={16} />
      </button>
      <span
        aria-hidden="true"
        className={cn("absolute bottom-0 left-0 h-0.5 origin-left", meta.bar)}
        style={{
          width: "100%",
          animation: `toast-progress ${toast.duration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </li>
  );
}

// Mount once at the app root. Fire toasts with useToast() or dispatch(toast.x()).
export default function Toaster() {
  const items = useSelector((s) => s.toast.items);
  return (
    <ol
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-md flex-col gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]"
    >
      {items.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ol>
  );
}

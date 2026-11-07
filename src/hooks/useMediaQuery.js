import { useSyncExternalStore } from "react";

// Matches Tailwind's `lg` breakpoint: sidebar layout, split chat view
export const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * const isDesktop = useMediaQuery(DESKTOP_QUERY);
 * Prefer responsive classes; reach for this only when the component tree
 * itself differs between layouts.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

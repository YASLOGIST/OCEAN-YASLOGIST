import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

export type Theme = "dark" | "light";

type Ctx = { theme: Theme; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const transitionBusy = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("oq-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("oq-theme", theme);
  }, [theme]);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
  }, []);

  const toggle = () => {
    // Ignore a second tap while the ~300ms visual morph is still in flight.
    // This prevents overlapping ViewTransition snapshots from stacking if a
    // user rapidly toggles the control on a high-refresh desktop display.
    if (transitionBusy.current) return;

    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    if (reduced || !doc.startViewTransition) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;
    const cleanup = () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
      transitionBusy.current = false;
      root.classList.remove("theme-transitioning");
    };

    transitionBusy.current = true;
    root.classList.add("theme-transitioning");
    // Defensive ceiling: even if a browser interrupts a ViewTransition's
    // finished promise, the UI can never remain locked or transitionless.
    transitionTimer.current = window.setTimeout(cleanup, 420);

    try {
      const transition = doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
        root.setAttribute("data-theme", next);
      });
      transition.finished.finally(cleanup);
    } catch {
      cleanup();
      setTheme(next);
    }
  };

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

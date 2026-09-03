import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";

/* ═══════════════════════ Global logistics clock ═══════════════════════
   Three critical logistics timezones, Cairo always first (corporate branch —
   New Cairo), then the world's busiest container port (Shanghai, the origin
   of the site's own Far East lane) and Europe's largest port.

   CLS discipline: the value is rendered in a fixed `ch` box with tabular
   figures, so the box cannot resize as digits tick. Offsets come from
   Intl.DateTimeFormat with IANA zones, so DST is handled by the platform —
   never hardcoded. One interval drives all three zones and is cleared on
   unmount.
──────────────────────────────────────────────────────────────────────── */

const ZONES = [
  { key: "cairo", tz: "Africa/Cairo" },
  { key: "shanghai", tz: "Asia/Shanghai" },
  { key: "rotterdam", tz: "Europe/Amsterdam" },
] as const;

/* Built once, not per tick. */
const FORMATTERS = ZONES.map((z) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: z.tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
);

function readAll(now: Date) {
  return FORMATTERS.map((f) => f.format(now));
}

export default function GlobalClock({ className }: { className?: string }) {
  const { t, lang } = useLang();
  const [times, setTimes] = useState<string[]>(() => readAll(new Date()));
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    /* A single timer for all three zones. 10s is ample for HH:MM and keeps the
       main thread almost entirely idle. */
    const tick = () => setTimes(readAll(new Date()));
    tick();
    timerRef.current = window.setInterval(tick, 10_000);
    return () => window.clearInterval(timerRef.current);
  }, []);

  return (
    <div
      className={cn("flex items-center gap-4", className)}
      role="group"
      aria-label={lang === "ar" ? "التوقيت العالمي" : "Global logistics time"}
    >
      {ZONES.map((z, i) => (
        <div key={z.key} className="flex flex-col items-start leading-none">
          <span
            className={cn(
              "block text-[8px] uppercase tracking-[0.18em] text-ghost",
              /* Ruq'ah is scoped to the Cairo label in Arabic only. */
              z.key === "cairo" && lang === "ar" ? "clock-ruqaa" : "font-mono"
            )}
          >
            {t(`clock.${z.key}`)}
          </span>
          <span
            className="clock-value mt-1 block font-mono text-[12px] tracking-[0.08em] text-ice"
            dir="ltr"
          >
            {times[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

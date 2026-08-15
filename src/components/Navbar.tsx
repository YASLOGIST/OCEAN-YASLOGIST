import { useEffect, useState } from "react";
import { subscribeScroll } from "../lib/scroll";
import { useLang } from "../lib/i18n";
import { useTheme } from "../lib/theme";
import { cn } from "../utils/cn";
import { BrandMark } from "./Brand";
import GlobalClock from "./GlobalClock";

function Logo() {
  const { t } = useLang();
  return (
    <a href="#hero" className="group flex items-center gap-2 sm:gap-3">
      <BrandMark id="nav" className="h-10 w-10 sm:h-11 sm:w-11" />
      {/* Below the 360px floor the bar is 46.7px over budget and the menu button
          goes off-screen. The wordmark is the only thing here that is decoration
          rather than function — the mark still identifies the site, while the
          language pill, theme toggle and menu button all survive. */}
      <span className="leading-none max-[360px]:hidden">
        <span className="flex items-center gap-1.5 font-display text-[13px] font-bold tracking-[0.1em] text-ice sm:text-lg">
          YASLOGIST
          {/* Decorative, and the first thing to go below `sm`: the phone header
              has no room for it (see the row budget note on the bar below). The
              brand subtitle is already hidden at this width for the same reason. */}
          <span className="hidden rounded-md border border-neon/40 bg-neon/10 px-1.5 py-0.5 font-mono text-[7px] font-normal tracking-[0.2em] text-neon sm:inline-block">
            CORE
          </span>
        </span>
        <span className="mt-1 hidden max-w-[250px] font-mono text-[6.5px] uppercase leading-[1.6] tracking-[0.12em] text-ghost sm:block">
          {t("nav.sub")}
        </span>
      </span>
    </a>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass gpu grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-neon transition-all duration-300 hover:border-neon/40"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

/* ── Language pill ───────────────────────────────────────────────────────
   Both languages are always visible, so the control reads as a state switch
   rather than a mystery button — you can see what you are on and what you would
   get. The knob is a single translated pseudo-element, so switching costs one
   compositor transform and no layout.

   "عربي" is set in Aref Ruqaa. Ruq'ah is the everyday Arabic hand — a native
   reader recognises it instantly as Arabic-for-Arabs rather than a translation
   afterthought, which is exactly the signal a premium localisation should send.
──────────────────────────────────────────────────────────────────────── */
function LangToggle() {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";
  return (
    <button
      type="button"
      onClick={() => setLang(isAr ? "en" : "ar")}
      role="switch"
      aria-checked={isAr}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      className="lang-pill"
      data-on={isAr ? "ar" : "en"}
    >
      <span className="lang-knob" aria-hidden />
      <span className={cn("lang-opt", !isAr && "lang-opt-on")}>EN</span>
      <span className={cn("lang-opt lang-opt-ar", isAr && "lang-opt-on")}>عربي</span>
    </button>
  );
}

export default function Navbar() {
  const { t, ta, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeScroll((f) => setScrolled(f.y > 48)), []);

  const links = ta("nav.links");
  const menuIds = ["hero", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];
  const menuLabels: Record<string, string> = {
    hero: lang === "ar" ? "نظرة عامة" : "Overview",
    solutions: t("hud.dots.1"),
    simulator: t("hud.dots.2"),
    p1: t("hud.dots.3"),
    p2: t("hud.dots.4"),
    p3: t("hud.dots.5"),
    p4: t("hud.dots.6"),
    p5: t("hud.dots.7"),
    connect: t("closing.short"),
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[9999] w-full transition-all duration-500",
          scrolled
            ? "border-b border-chrome/10 bg-abyss/55 py-2.5 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent py-5"
        )}
        style={{ backdropFilter: scrolled ? "blur(16px)" : "none", WebkitBackdropFilter: scrolled ? "blur(16px)" : "none" }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-10",
            /* At >=2xl the row reveals GlobalClock, and in English the content
               then needs 1222.69px against the 1158px max-w-7xl leaves. Flex
               pays that 64.69px shortfall by wrapping the status pill onto two
               lines and crushing the theme toggle from 40px to 30.89px. The cap
               never grows with the viewport, so a higher breakpoint only moves
               the defect; widening the bar to the section content grid (1280px)
               is what gives the row its natural width back. Arabic's labels are
               narrower and already fit with 176px to spare, so it keeps the 7xl
               cap and its geometry is untouched. */
            lang === "en" && "2xl:max-w-[85rem]"
          )}
        >
          <div
            className={cn(
              /* Below `sm` the bar is over-subscribed: logo 194.5px + controls
                 192px + gap needs 410.5px against the 316px a 390px phone
                 leaves, so the row overflowed by 94.5px and pushed the menu
                 button 57.5px off-screen — unreachable, and silently, because
                 `overflow-x-clip` on the page wrapper hides the spill. The
                 mobile gap and padding steps here are part of clawing that
                 back; every one of them restores its current value at `sm`. */
              "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 transition-all duration-500 sm:gap-6 sm:px-5",
              scrolled ? "glass-strong" : "border border-transparent bg-transparent"
            )}
          >
            <div className="flex items-center gap-3.5">
              <Logo />
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              {links.map((l, i) => (
                <a
                  key={l}
                  href={`#p${i + 1}`}
                  className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-ghost transition-colors hover:text-neon"
                >
                  {l}
                  <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-neon shadow-[0_0_8px_var(--glow)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Global logistics clock — Cairo first. Fixed-width numerals, so
                  the header height never moves as the digits tick. */}
              <GlobalClock className="hidden 2xl:flex" />
              <span className="hidden h-8 w-px bg-chrome/15 2xl:block" />

              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300 xl:inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {t("nav.status")}
              </span>

              <LangToggle />
              <ThemeToggle />

              {/* The "Connect Directly" CTA was removed from this row. It cost
                  159px of a row that is width-capped at 1200px by max-w-7xl, and
                  in English that pushed the row 108px over budget — the browser
                  paid for it by crushing the theme toggle and the clock. Connect
                  is still reachable from the dot navigation, the footer and the
                  closing section, so the header copy was redundant. */}

              <button
                onClick={() => setOpen(!open)}
                className="glass gpu grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-neon lg:hidden"
                aria-label="Toggle menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu (below navbar lock so the toggle stays interactive) */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] flex flex-col justify-center gap-2 px-8 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{
          background: "color-mix(in srgb, var(--c-bg) 72%, transparent)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {menuIds.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            className="group flex items-baseline gap-4 border-b border-chrome/10 py-4"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span className="font-mono text-[10px] text-neon/60">0{i + 1}</span>
            <span className="font-display text-3xl font-semibold text-ice transition-colors group-hover:text-neon">
              {menuLabels[id]}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

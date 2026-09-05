import { useEffect, useState } from "react";
import { subscribeScroll } from "../lib/scroll";
import { SUPPORTED_LANGUAGES, useLang, type Lang } from "../lib/i18n";
import { useTheme } from "../lib/theme";
import { cn } from "../utils/cn";
import { BrandMark } from "./Brand";
import SuiteSwitcher from "./SuiteSwitcher";
import GlobalClock from "./GlobalClock";

function Logo() {
  const { t } = useLang();
  return (
    <a href="#hero" className="group flex shrink-0 items-center gap-2 sm:gap-3 select-none">
      <BrandMark className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />
      <span className="leading-none max-[360px]:hidden">
        <span className="flex items-center gap-1.5 font-display text-[13px] font-bold tracking-[0.1em] text-ice sm:text-lg whitespace-nowrap">
          YASLOGIST
          <span className="hidden rounded-md border border-neon/40 bg-neon/10 px-1.5 py-0.5 font-mono text-[7px] font-normal tracking-[0.2em] text-neon sm:inline-block">
            CORE
          </span>
        </span>
        <span className="mt-1 hidden max-w-[250px] font-mono text-[6.5px] uppercase leading-[1.6] tracking-[0.12em] text-ghost sm:block whitespace-nowrap truncate">
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
      className="glass gpu grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl text-neon transition-all duration-300 hover:border-neon/40"
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

/* ── Multi-Language Segmented Switcher (Desktop & Tablets) ───────────────── */
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      dir="ltr"
      role="radiogroup"
      aria-label="Language selection"
      className="hidden sm:inline-flex items-center rounded-full border border-chrome/15 bg-abyss/85 p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] backdrop-blur-xl shrink-0"
    >
      {SUPPORTED_LANGUAGES.map((item) => {
        const isSelected = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setLang(item.code)}
            className={cn(
              "relative px-2 xl:px-2.5 py-1 text-[10px] xl:text-[10.5px] font-bold select-none rounded-full transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-gradient-to-r from-neon to-cyan-400 text-abyss font-black shadow-[0_0_14px_rgba(34,228,255,0.7)]"
                : "text-ghost hover:text-ice hover:bg-chrome/5"
            )}
            style={item.code === "ar" ? { fontFamily: "var(--font-ruqaa)", fontSize: "12px", lineHeight: "1" } : undefined}
            title={item.nativeName}
            aria-label={`Switch language to ${item.nativeName}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Mobile Compact Language Button ─────────────────────────────────────── */
function MobileLangButton() {
  const { lang, setLang } = useLang();
  const nextLang: Record<Lang, Lang> = {
    en: "ar",
    ar: "zh",
    zh: "tr",
    tr: "fr",
    fr: "en",
  };
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  return (
    <button
      type="button"
      onClick={() => setLang(nextLang[lang])}
      aria-label={`Current language: ${current.nativeName}. Tap to cycle.`}
      className="sm:hidden glass gpu flex h-10 min-w-10 px-2.5 cursor-pointer items-center justify-center rounded-xl border border-neon/30 text-neon font-display text-[11px] font-bold transition-all active:scale-95 shrink-0"
      style={lang === "ar" ? { fontFamily: "var(--font-ruqaa)", fontSize: "13px" } : undefined}
    >
      <span>{current.label}</span>
    </button>
  );
}

export default function Navbar() {
  const { t, ta, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeScroll((f) => setScrolled(f.y > 48)), []);

  const links = ta("nav.links");
  const menuIds = ["hero", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];
  const menuLabels: Record<string, string> = {
    hero: lang === "ar" ? "نظرة عامة" : lang === "zh" ? "走廊概览" : lang === "tr" ? "Genel Bakış" : lang === "fr" ? "Aperçu" : "Overview",
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
            : "border-b border-transparent bg-transparent py-4 sm:py-5"
        )}
        style={{ backdropFilter: scrolled ? "blur(16px)" : "none", WebkitBackdropFilter: scrolled ? "blur(16px)" : "none" }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-6 xl:px-8 xl:max-w-[84rem] 2xl:max-w-[86rem]"
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between gap-1.5 sm:gap-4 md:gap-6 rounded-2xl px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 transition-all duration-500",
              scrolled ? "glass-strong" : "border border-transparent bg-transparent"
            )}
          >
            <div className="flex shrink-0 items-center gap-2 sm:gap-3.5">
              <Logo />
            </div>

            <nav className="hidden items-center gap-3.5 lg:flex xl:gap-5 2xl:gap-7">
              {links.map((l, i) => (
                <a
                  key={l}
                  href={`#p${i + 1}`}
                  className="group relative font-mono text-[10.5px] xl:text-[11px] uppercase tracking-[0.14em] xl:tracking-[0.22em] text-ghost transition-colors hover:text-neon whitespace-nowrap select-none"
                >
                  {l}
                  <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-neon shadow-[0_0_8px_var(--glow)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-2.5">
              {/* Global logistics clock — Cairo first. Fixed-width numerals, so
                  the header height never moves as the digits tick. */}
              <GlobalClock className="hidden 2xl:flex" />
              <span className="hidden h-8 w-px bg-chrome/15 2xl:block" />

              <span className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300 whitespace-nowrap 2xl:inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {t("nav.status")}
              </span>

              {/* Suite switcher */}
              <SuiteSwitcher current="ocean" className="hidden xl:flex" />

              <MobileLangButton />
              <LangToggle />
              <ThemeToggle />

              <button
                onClick={() => setOpen(!open)}
                className="glass gpu grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl text-neon lg:hidden"
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

      {/* mobile menu (below navbar lock so the toggle stays interactive).

          `.nav-menu` carries the vertical contract: nine rows at the desktop
          type scale measured 685px against a 664px phone viewport, and plain
          `justify-content: center` split that 21px overflow across BOTH ends —
          row 01 landed at -10.5px, unreachable because nothing scrolled, and
          entirely behind this header, which outranks the menu in z-order. Row
          02 was the first thing the eye found, 16.5px of it clipped. The row
          padding and type step below `sm` are what bring all nine back inside
          a phone viewport; `.nav-menu` guarantees the rest. */}
      <div
        className={cn(
          "nav-menu fixed inset-0 z-[9998] flex flex-col gap-2 px-8 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{
          background: "color-mix(in srgb, var(--c-bg) 72%, transparent)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Suite grid first: a visitor who opened this menu to leave for another
            surface should not have to scroll nine section links to find the
            way out. `.nav-menu` is `overflow-y: auto` with `safe center`
            (HANDOFF Bug B), so the added height degrades to a scroll on the
            shortest viewports rather than clipping a row. */}
        <SuiteSwitcher
          current="ocean"
          variant="grid"
          onNavigate={() => setOpen(false)}
          className="mb-3 border-b border-chrome/10 pb-4"
        />

        {/* 5-Language selection in mobile drawer */}
        <div className="mb-3 border-b border-chrome/10 pb-4">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-neon">
            {lang === "ar"
              ? "اختر لغة المنصة"
              : lang === "zh"
              ? "选择平台语言"
              : lang === "tr"
              ? "Platform Dilini Seçin"
              : lang === "fr"
              ? "Choisir la Langue"
              : "Select Platform Language"}
          </p>
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl border border-chrome/15 bg-chrome/[0.03]">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all",
                    isSelected
                      ? "bg-neon text-abyss font-bold shadow-[0_0_12px_var(--glow)]"
                      : "text-ghost hover:text-ice hover:bg-chrome/5"
                  )}
                  style={item.code === "ar" ? { fontFamily: "var(--font-ruqaa)" } : undefined}
                >
                  <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                  <span className="text-[8px] opacity-75 leading-tight truncate max-w-full">{item.nativeName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {menuIds.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            className="group flex items-baseline gap-4 border-b border-chrome/10 py-2 sm:py-4"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span className="font-mono text-[10px] text-neon/60">0{i + 1}</span>
            <span className="font-display text-2xl font-semibold text-ice transition-colors group-hover:text-neon sm:text-3xl">
              {menuLabels[id]}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

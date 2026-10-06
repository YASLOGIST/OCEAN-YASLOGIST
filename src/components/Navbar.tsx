import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "../lib/scroll";
import { SUPPORTED_LANGUAGES, useLang, type Lang } from "../lib/i18n";
import { useTheme } from "../lib/theme";
import { cn } from "../utils/cn";
import { BrandMark } from "./Brand";
import SuiteSwitcher from "./SuiteSwitcher";

const NAV_UI: Record<Lang, {
  home: string;
  themeLight: string;
  themeDark: string;
  language: string;
  currentLanguage: string;
  nextLanguage: string;
  menuOpen: string;
  menuClose: string;
  mobileSections: string;
}> = {
  en: { home: "YASLOGIST Ocean home", themeLight: "Switch to light theme", themeDark: "Switch to dark theme", language: "Language selection", currentLanguage: "Current language", nextLanguage: "Activate to switch to the next language", menuOpen: "Open navigation menu", menuClose: "Close navigation menu", mobileSections: "Section navigation" },
  ar: { home: "الصفحة الرئيسية لـ YASLOGIST البحري", themeLight: "التبديل إلى المظهر الفاتح", themeDark: "التبديل إلى المظهر الداكن", language: "اختيار اللغة", currentLanguage: "اللغة الحالية", nextLanguage: "اضغط للانتقال إلى اللغة التالية", menuOpen: "فتح قائمة التنقل", menuClose: "إغلاق قائمة التنقل", mobileSections: "التنقل بين الأقسام" },
  zh: { home: "YASLOGIST 海运首页", themeLight: "切换至浅色主题", themeDark: "切换至深色主题", language: "语言选择", currentLanguage: "当前语言", nextLanguage: "启用后切换到下一种语言", menuOpen: "打开导航菜单", menuClose: "关闭导航菜单", mobileSections: "章节导航" },
  tr: { home: "YASLOGIST Ocean ana sayfası", themeLight: "Açık temaya geç", themeDark: "Koyu temaya geç", language: "Dil seçimi", currentLanguage: "Geçerli dil", nextLanguage: "Sonraki dile geçmek için etkinleştirin", menuOpen: "Gezinme menüsünü aç", menuClose: "Gezinme menüsünü kapat", mobileSections: "Bölüm gezintisi" },
  fr: { home: "Accueil YASLOGIST Maritime", themeLight: "Passer au thème clair", themeDark: "Passer au thème sombre", language: "Choix de la langue", currentLanguage: "Langue actuelle", nextLanguage: "Activer pour passer à la langue suivante", menuOpen: "Ouvrir le menu de navigation", menuClose: "Fermer le menu de navigation", mobileSections: "Navigation des sections" },
};

function Logo() {
  const { t, lang } = useLang();
  return (
    <a href="#hero" aria-label={NAV_UI[lang].home} className="group flex min-h-11 min-w-11 shrink-0 items-center gap-2 sm:gap-3 select-none">
      <BrandMark className="h-9 w-9 sm:h-10 sm:w-10 xl:h-11 xl:w-11 shrink-0" />
      <span className="leading-none max-[360px]:hidden">
        <span className="flex items-center gap-1.5 font-display text-[13px] font-bold tracking-[0.1em] text-ice sm:text-base xl:text-lg whitespace-nowrap">
          YASLOGIST
          <span className="nav-demo-chip hidden rounded-md px-1.5 py-0.5 font-mono text-[7px] font-semibold tracking-[0.18em] sm:inline-block">
            DEMO
          </span>
        </span>
        <span className="mt-1 hidden max-w-[160px] xl:max-w-[210px] 2xl:max-w-[250px] font-mono text-[6.5px] uppercase leading-[1.6] tracking-[0.12em] text-ghost lg:block whitespace-nowrap truncate">
          {t("nav.sub")}
        </span>
      </span>
    </a>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { lang } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? NAV_UI[lang].themeLight : NAV_UI[lang].themeDark}
      aria-pressed={theme === "light"}
      className="glass gpu grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl text-neon transition-all duration-300 hover:border-neon/40"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
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
      aria-label={NAV_UI[lang].language}
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
              "relative min-h-11 px-1.5 sm:px-2 xl:px-2.5 py-0.5 xl:py-1 text-[9.5px] xl:text-[10.5px] font-bold select-none rounded-full transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-gradient-to-r from-neon to-cyan-400 text-abyss font-black shadow-[0_0_14px_rgba(34,228,255,0.7)]"
                : "text-ghost hover:text-ice hover:bg-chrome/5"
            )}
            style={item.code === "ar" ? { fontFamily: "var(--font-ruqaa)", fontSize: "12px", lineHeight: "1" } : undefined}
            title={item.nativeName}
            aria-label={`${NAV_UI[lang].language}: ${item.nativeName}`}
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
      aria-label={`${NAV_UI[lang].currentLanguage}: ${current.nativeName}. ${NAV_UI[lang].nextLanguage}.`}
      className="sm:hidden glass gpu flex h-11 min-w-11 px-2.5 cursor-pointer items-center justify-center rounded-xl border border-neon/30 text-neon font-display text-[11px] font-bold transition-all active:scale-95 shrink-0"
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
  const scrolledRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Crossing the header threshold is the only event React needs. The scroll
     engine can publish dozens of frames while settling; scheduling the same
     boolean on every one adds work without changing the rendered header. */
  useEffect(() => subscribeScroll((f) => {
    const next = f.y > 48;
    if (next === scrolledRef.current) return;
    scrolledRef.current = next;
    setScrolled(next);
  }), []);

  /* The drawer is a modal navigation surface on tablet and phone: hidden links
     are removed from the tab order, Escape closes it, focus cannot leak into
     the page behind it, and page scrolling is restored without a layout jump. */
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = background.map((el) => el.inert);
    background.forEach((el) => { el.inert = true; });
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingInlineEnd = `${scrollbarGap}px`;

    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((el) => !el.hasAttribute("inert"));
    const focusRaf = requestAnimationFrame(() => focusables()[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusRaf);
      document.removeEventListener("keydown", onKeyDown);
      background.forEach((el, index) => { el.inert = previousInert[index]; });
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
      if (menuButtonRef.current?.offsetParent !== null) menuButtonRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeAtDesktop);
    return () => desktop.removeEventListener("change", closeAtDesktop);
  }, []);

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
            "mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-6 xl:px-8 xl:max-w-[84rem] 2xl:max-w-[88rem]"
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between gap-1.5 sm:gap-3 md:gap-4 lg:gap-6 rounded-2xl px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 transition-all duration-500",
              scrolled ? "glass-strong" : "border border-transparent bg-transparent"
            )}
          >
            <div className="flex shrink-0 items-center gap-2 sm:gap-3.5">
              <Logo />
            </div>

            <nav className="hidden items-center gap-2.5 lg:flex xl:gap-4 2xl:gap-6 shrink-0">
              {links.map((l, i) => (
                <a
                  key={l}
                  href={`#p${i + 1}`}
                  className="group relative font-mono text-[10px] xl:text-[10.5px] uppercase tracking-[0.12em] xl:tracking-[0.18em] text-ghost transition-colors hover:text-neon whitespace-nowrap select-none"
                >
                  {l}
                  <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-neon shadow-[0_0_8px_var(--glow)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 xl:gap-3">
              {/* Suite switcher */}
              <SuiteSwitcher current="ocean" className="hidden xl:flex" />

              <MobileLangButton />
              <LangToggle />
              <ThemeToggle />

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="glass gpu grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl text-neon lg:hidden"
                aria-label={open ? NAV_UI[lang].menuClose : NAV_UI[lang].menuOpen}
                aria-expanded={open}
                aria-controls="mobile-navigation"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden focusable="false">
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
        ref={menuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={NAV_UI[lang].mobileSections}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "nav-menu fixed inset-0 z-[9998] flex flex-col gap-2 px-8 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none invisible opacity-0"
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
                  aria-pressed={isSelected}
                  aria-label={`${NAV_UI[lang].language}: ${item.nativeName}`}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all",
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

        <nav aria-label={NAV_UI[lang].mobileSections} className="flex flex-col gap-2">
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
        </nav>
      </div>
    </>
  );
}

import { useState } from "react";
import { useLang } from "../lib/i18n";
import { BrandMark } from "./Brand";
import LegalModal from "./LegalModal";

type LegalKey = "terms" | "privacy" | "security";

export default function Footer() {
  const { t, ta } = useLang();
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const cols = [0, 1, 2].map((i) => ({
    head: t(`footer.cols.${i}.head`),
    links: [0, 1, 2, 3].map((j) => t(`footer.cols.${i}.links.${j}`)),
  }));

  return (
    <footer className="site-footer relative overflow-hidden px-6 pb-10 pt-8 lg:px-10">
      {/* link columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 border-t border-chrome/10 pt-14 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <BrandMark id="foot" className="h-11 w-11" />
            <span className="leading-none">
              <span className="flex items-center gap-1.5 font-display text-lg font-bold tracking-[0.1em] text-ice">
                YASLOGIST
                <span className="rounded-md border border-neon/40 bg-neon/10 px-1.5 py-0.5 font-mono text-[7px] font-normal tracking-[0.2em] text-neon">
                  CORE
                </span>
              </span>
              <span className="mt-1 block max-w-[250px] font-mono text-[6.5px] uppercase leading-[1.6] tracking-[0.12em] text-ghost">
                {t("nav.sub")}
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ghost">{t("footer.blurb")}</p>

          <div className="mt-6 flex items-center gap-3">
            {["X", "in", "WA"].map((s) => (
              <a
                key={s}
                href={s === "WA" ? "https://wa.me/201002029997" : "#connect"}
                target={s === "WA" ? "_blank" : undefined}
                rel={s === "WA" ? "noopener noreferrer" : undefined}
                className="grid h-10 w-10 place-items-center rounded-xl border border-chrome/10 bg-chrome/[0.04] font-mono text-[10px] uppercase text-ghost transition-all duration-300 hover:border-neon/50 hover:text-neon hover:shadow-[0_0_16px_var(--glow-soft)]"
              >
                {s}
              </a>
            ))}
          </div>
          <a
            href="tel:+201002029997"
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-ghost transition-colors hover:text-neon"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {t("closing.phone")}
            </span>
          </a>
        </div>

        {cols.map((c) => (
          <div key={c.head}>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">{c.head}</div>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#connect" className="text-sm text-ghost transition-colors hover:text-ice">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* bottom bar */}
      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-chrome/10 pt-7 sm:flex-row">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ice/40">{t("footer.bottom")}</p>
        <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.22em] text-ghost">
          {(["terms", "privacy", "security"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setLegal(k)}
              className="cursor-pointer uppercase tracking-[0.22em] transition-colors hover:text-neon"
            >
              {t(`footer.${k}`)}
            </button>
          ))}
        </div>
        <button
          onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
          className="group flex cursor-pointer items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ghost transition-colors hover:text-neon"
        >
          {t("footer.back")}
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-chrome/10 bg-chrome/[0.04] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-neon/50">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>

      <LegalModal
        open={legal !== null}
        title={legal ? t(`footer.${legal}`) : ""}
        paragraphs={legal ? ta(`footer.legal.${legal}`) : []}
        onClose={() => setLegal(null)}
      />
    </footer>
  );
}

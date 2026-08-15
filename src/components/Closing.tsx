import type { CSSProperties } from "react";
import { useLang } from "../lib/i18n";
import { Reveal } from "./ui";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export default function Closing() {
  const { t } = useLang();
  const WA_LINK = "https://wa.me/201002029997";

  return (
    <section id="connect" className="section-iso cv-auto relative scroll-mt-24 px-8 pb-12 pt-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          {/* The card now rides the shared `.glass-strong` surface rather than a
              bespoke inline blur. Two reasons: it inherits the site's established
              glass language (border, inset highlight, theme-aware gradient) for
              free, and it drops this surface's blur radius from 20px to the
              system's 6px. Blur radius is the dominant backdrop-filter cost, so
              this reduces P5's weight without changing P5's surface count. */}
          <div className="connect-card glass-strong gpu relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
            {/* One atmospheric glow, not three. R1: painted as a radial-gradient
                rather than a blurred circle — a `filter` promotes its own
                compositor surface, a gradient does not. */}
            <div
              className="glow-wash pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full"
              style={{ "--wash": "rgba(34, 228, 255, 0.1)" } as CSSProperties}
            />

            <div className="relative">
              <p className="micro font-mono text-neon">{t("closing.tag")}</p>

              {/* Hairline rule under the eyebrow: a small piece of structure that
                  reads as letterhead rather than as a web form. */}
              <span className="connect-rule" aria-hidden />

              <h2 className="connect-headline h2-display mx-auto mt-7 max-w-3xl font-display text-ice">
                {t("closing.title1")}{" "}
                <span className="text-accent-grad text-glow">{t("closing.title2")}</span>
              </h2>

              <p className="sub-text mx-auto mt-7 max-w-xl">{t("closing.sub")}</p>

              {/* One unambiguous primary action; the call is the secondary path.
                  Both carry visible focus rings for keyboard operation. */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary group inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-display text-base font-bold tracking-wide"
                >
                  <WhatsAppIcon className="h-6 w-6 shrink-0" />
                  {t("closing.ctaWhats")}
                </a>

                <a
                  href="tel:+201002029997"
                  className="cta-secondary btn-ghost gpu inline-flex items-center gap-2.5 rounded-2xl px-6 py-4 font-display text-sm font-semibold tracking-wide"
                >
                  <PhoneIcon className="h-5 w-5 shrink-0 text-neon" />
                  {t("closing.ctaCall")}
                </a>
              </div>

              {/* phone — dir locked so RTL never reverses it */}
              <div className="mt-8">
                <a
                  href="tel:+201002029997"
                  className="cta-phone tabular font-display text-2xl font-bold tracking-wide text-ice sm:text-3xl"
                >
                  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {t("closing.phone")}
                  </span>
                </a>
                <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.22em] text-ghost/70">
                  {t("closing.note")}
                </p>
              </div>

              {/* Provenance block — authorship first, then the office that
                  stands behind it. `closing.sub` above carries the promise
                  ("reaches him directly"); this carries the credential. They are
                  deliberately different claims, not two phrasings of one. */}
              <div className="connect-provenance">
                <p className="connect-built">{t("closing.built")}</p>
                <p className="mt-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-ghost/70">
                  {t("closing.office")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

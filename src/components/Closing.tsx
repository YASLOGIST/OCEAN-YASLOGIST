import { useLang } from "../lib/i18n";
import { FounderAvatar } from "./Brand";

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>;
}

export default function Closing() {
  const { t } = useLang();
  const WA_LINK = "https://wa.me/201041139910";

  return (
    <section id="connect" className="founder-channel section-iso cv-auto relative scroll-mt-24 px-6 pb-14 pt-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="founder-channel-shell founder-connect-console glass-strong gpu">
          <div className="founder-portrait-stage">
            <div className="founder-orbit founder-orbit-a" aria-hidden><i /><i /><i /></div>
            <div className="founder-orbit founder-orbit-b" aria-hidden><i /><i /></div>
            <div className="founder-portrait-beam" aria-hidden />
            <FounderAvatar initials="AY" className="founder-channel-avatar" />
            <div className="founder-channel-status"><i /> DIRECT CHANNEL</div>
            <div className="founder-channel-identity">
              <small>{t("founder.lead")}</small>
              <strong>{t("founder.name")}</strong>
              <span>{t("founder.title")}</span>
            </div>
          </div>

          <div className="founder-channel-copy">
            <div className="founder-channel-kicker"><span />{t("closing.tag")}</div>
            <h2 className="founder-channel-title">{t("closing.title1")} <em>{t("closing.title2")}</em></h2>
            <p className="founder-channel-sub">{t("closing.sub")}</p>

            <div className="founder-channel-actions">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="founder-action-primary">
                <i><WhatsAppIcon /></i><span>{t("closing.ctaWhats")}</span><b>↗</b>
              </a>
              <a href="tel:+201041139910" className="founder-action-secondary">
                <i><PhoneIcon /></i><span>{t("closing.ctaCall")}</span>
              </a>
            </div>

            <div className="founder-signal-line">
              <span className="founder-signal-wave" aria-hidden><i /><i /><i /><i /><i /></span>
              <a href="tel:+201041139910" dir="ltr">{t("closing.phone")}</a>
              <small>{t("closing.note")}</small>
            </div>

            <div className="founder-channel-footer">
              <p>{t("closing.built")}</p>
              <span>{t("closing.office")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

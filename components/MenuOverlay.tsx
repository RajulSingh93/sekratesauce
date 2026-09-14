import s from "./site.module.css";
import { email, menuItems, social } from "@/lib/site-data";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MenuOverlay({ open, onClose }: Props) {
  return (
    <div
      className={s.menu}
      style={{
        clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      <div className={s.menuInner}>
        <nav className={s.menuNav}>
          <span className={`${s.chip} ${s.chipStart}`} style={{ marginBottom: 4 }}>
            Navigate
          </span>
          {menuItems.map(([label, href, sub], i) => (
            <a
              key={href}
              href={href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={s.menuLink}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(24px)",
                transitionDelay: open ? `${0.15 + i * 0.05}s` : "0s",
              }}
            >
              <span className={s.menuNo}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.menuLabel}>{label}</span>
              <span className={s.menuSub}>{sub}</span>
            </a>
          ))}
        </nav>

        <aside
          className={s.menuAside}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(24px)",
            transitionDelay: open ? "0.45s" : "0s",
          }}
        >
          <div className={s.asideGroup}>
            <span className={`${s.chip} ${s.chipStart}`} style={{ marginBottom: 4 }}>
              Booking
            </span>
            <a
              href="#booking"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={s.solidBtn}
            >
              Book Sekrate Sauce
            </a>
            <a href={`mailto:${email}`} tabIndex={open ? 0 : -1} className={s.asideEmail}>
              {email}
            </a>
          </div>

          <div className={s.asideGroup}>
            <span className={`${s.chip} ${s.chipStart}`} style={{ marginBottom: 4 }}>
              Follow
            </span>
            <nav className={s.stackNav}>
              <a href={social.instagram} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
                Instagram ↗
              </a>
              <a href={social.youtube} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
                YouTube ↗
              </a>
              <a href={social.soundcloud} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
                SoundCloud ↗
              </a>
            </nav>
          </div>

          <div className={s.menuMeta}>
            <span className={s.menuMetaStrong}>DJ / Producer / Open Format</span>
            <span>
              Tech House · Dubstep · Trap House · Amapiano · Jersey House · UK
              Garage
            </span>
            <span>Seven-plus years behind the decks</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

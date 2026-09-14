import s from "./site.module.css";
import { email, social } from "@/lib/site-data";

export default function Footer({ year }: { year: number }) {
  return (
    <footer id="contact" className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerCols}>
          <div className={s.footerCol}>
            <span className={`${s.chip} ${s.chipStart}`}>Explore</span>
            <nav className={s.footerNav}>
              <a href="#music">Music</a>
              <a href="#mixtapes">Mixtapes</a>
              <a href="#photos">Photos</a>
              <a href="#radio">Radio Mix</a>
              <a href="#about">About</a>
              <a href="#services">DJ Services</a>
            </nav>
          </div>

          <div className={s.footerCol}>
            <span className={`${s.chip} ${s.chipStart}`}>Follow</span>
            <nav className={s.footerNav}>
              <a href={social.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
              <a href={social.youtube} target="_blank" rel="noopener">
                YouTube
              </a>
              <a href={social.soundcloud} target="_blank" rel="noopener">
                SoundCloud
              </a>
            </nav>
          </div>

          <div className={s.footerCol}>
            <span className={`${s.chip} ${s.chipStart}`}>Booking / Contact</span>
            <a href={`mailto:${email}`} className={s.footerEmail}>
              {email}
            </a>
          </div>
        </div>

        <p className={`${s.display} ${s.footerMark}`}>Sekrate Sauce</p>

        <div className={s.footerBottom}>
          <span>© SEKRATE SAUCE {year}. All rights reserved.</span>
          <div className={s.footerLinks}>
            <a href="#" style={{ color: "inherit" }}>
              Terms
            </a>
            <a href="#" style={{ color: "inherit" }}>
              Privacy
            </a>
            <a href="#home" style={{ color: "inherit" }}>
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import s from "./site.module.css";
import { services } from "@/lib/site-data";

export default function Services() {
  return (
    <section id="services" data-reveal className={`${s.services} ${s.reveal}`}>
      <div className={s.servicesInner}>
        <div className={s.servicesHead}>
          <h2 data-drift className={`${s.display} ${s.servicesTitle}`}>
            DJ
            <br />
            Services
          </h2>
          <a href="#booking" className={s.darkBtn}>
            Book Sekrate Sauce
          </a>
        </div>
        <div className={s.servicesGrid}>
          {services.map((title, i) => (
            <a key={title} href="#booking" className={s.serviceCard}>
              <span className={s.serviceNo}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={s.serviceName}>{title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

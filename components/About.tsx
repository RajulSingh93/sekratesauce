import Image from "next/image";
import s from "./site.module.css";

const facts: [string, string][] = [
  ["Format", "Open Format"],
  [
    "Genres",
    "Tech House · Dubstep · Trap House · Amapiano · Jersey House · UK Garage",
  ],
];

export default function About() {
  return (
    <section id="about" data-reveal className={`${s.about} ${s.reveal}`}>
      <div className={s.aboutGrid}>
        <div className={s.aboutCol}>
          <p className={`${s.chip} ${s.chipStart}`} style={{ margin: 0 }}>
            About
          </p>
          <h2 className={s.aboutTitle}>
            Sekrate
            <br />
            Sauce
          </h2>
          <p className={s.aboutLede}>
            On the decks from Bhopal to New York.
          </p>
          <p className={s.aboutSub}>
            I spent years collecting sounds, discovering combinations, and
            chasing that perfect moment.{" "}
            <span className={s.muted}>
              Somewhere along the way, I kept adding SEKRATE SAUCE to my
              transition.
            </span>
          </p>

          <div className={s.aboutBody}>
            <p>
              Former Resident DJ for New York Fashion Week, Spring and Fall
              seasons, performing across shows, collaborating with designers,
              and playing venues including Sony Hall and Times Square.
            </p>
            <p>
              Promoter and DJ with Dream Hospitality, a nightlife management
              group, and a regular at several high-profile NYC nightlife
              destinations, including The DL NYC and Harbour NYC. Has worked
              alongside and shared lineups with Black Coffee, Major League DJz,
              and other DJs and Hip Hop artists.
            </p>
            <p>
              The sound blends Trap House, Dubstep and Tech House, driven by
              bass, energy, sharp song selection and an ability to read the room
              to create unforgettable sets.
            </p>
          </div>

          <dl className={s.facts}>
            {facts.map(([key, value]) => (
              <div key={key} className={s.fact}>
                <dt className={s.factKey}>{key}</dt>
                <dd className={s.factVal}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={s.aboutSide}>
          <div className={s.portrait}>
            <div className={s.zoom}>
              <Image
                src="/assets/about-portrait.jpg"
                alt="Sekrate Sauce portrait"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <blockquote className={s.quote}>
            <span className={`${s.chip} ${s.chipStart}`}>In his words</span>
            <p className={s.quoteText}>
              “It’s not just love for music; it’s my passion. It goes beyond
              liking and beyond a hobby.{" "}
              <span className={s.muted5}>
                It’s about a way of living. Music is essential to my life.”
              </span>
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

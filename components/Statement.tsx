import s from "./site.module.css";

export default function Statement() {
  return (
    <section data-reveal className={`${s.statement} ${s.reveal}`}>
      <p className={s.statementText}>
        An open-format DJ with seven years behind the decks —{" "}
        <span className={s.muted45}>
          blending Tech House, Dubstep, Trap House, Amapiano, Jersey House, UK
          Garage and diverse sounds into high-energy sets built around the crowd.
        </span>
      </p>
    </section>
  );
}

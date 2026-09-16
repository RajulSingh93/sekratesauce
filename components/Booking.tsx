import type { FormEvent } from "react";
import s from "./site.module.css";
import { eventTypes } from "@/lib/site-data";

type Props = {
  note: string;
  sending: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function Booking({ note, sending, onSubmit }: Props) {
  return (
    <section id="booking" data-reveal className={`${s.booking} ${s.reveal}`}>
      <div className={s.bookingInner}>
        <div className={s.bookingHead}>
          <h2 data-drift className={`${s.display} ${s.bookingTitle}`}>
            Book
            <br />
            Sekrate Sauce
          </h2>
          <p className={s.bookingNote}>
            Clubs, private and corporate events, brand activations, festivals,
            guest mixes. Fill in the form or email direct.
          </p>
        </div>

        <form onSubmit={onSubmit} className={s.form}>
          {/* Spam trap: invisible to people, so only bots fill it in. */}
          <div className={s.trap} aria-hidden="true">
            <input name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <label className={s.field}>
            Name
            <input name="name" required className={s.input} />
          </label>
          <label className={s.field}>
            Email
            <input name="email" type="email" required className={s.input} />
          </label>
          <label className={s.field}>
            Phone
            <input name="phone" type="tel" className={s.input} />
          </label>
          <label className={s.field}>
            Event type
            <select name="type" className={s.input}>
              {eventTypes.map((type) => (
                <option key={type} className={s.option}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className={s.field}>
            Event date
            <input
              name="date"
              type="date"
              className={`${s.input} ${s.dateInput}`}
            />
          </label>
          <label className={s.field}>
            Event location
            <input name="location" className={s.input} />
          </label>
          <label className={`${s.field} ${s.fieldWide}`}>
            Message
            <textarea
              name="message"
              rows={3}
              className={`${s.input} ${s.textarea}`}
            />
          </label>

          <div className={s.formFoot}>
            <button type="submit" disabled={sending} className={s.submit}>
              {sending ? "Sending…" : "Send booking request"}
            </button>
            <p className={s.formStatus} aria-live="polite">
              {note}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

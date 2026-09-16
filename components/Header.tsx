import Image from "next/image";
import s from "./site.module.css";

type Props = {
  scrolled: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function Header({ scrolled, open, onToggle, onClose }: Props) {
  return (
    <header
      className={s.header}
      style={{ paddingBlock: scrolled ? "14px" : "26px" }}
    >
      <a
        href="#home"
        onClick={onClose}
        className={`${s.mark} ${scrolled ? s.markScrolled : ""}`}
      >
        {/* White on transparent, so the header's difference blend inverts
            it over light sections just as it did the text wordmark. */}
        <Image
          src="/brand/logo-white.png"
          alt="SEKRATE SAUCE"
          width={96}
          height={94}
          loading="eager"
          className={s.logo}
        />
      </a>
      <button onClick={onToggle} aria-label="Menu" className={s.menuBtn}>
        <span className={s.bars}>
          <span
            className={s.bar}
            style={{
              transform: open ? "translateY(3.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className={s.bar}
            style={{
              transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none",
            }}
          />
        </span>
        <span className={s.menuBtnLabel}>{open ? "Close" : "Menu"}</span>
      </button>
    </header>
  );
}

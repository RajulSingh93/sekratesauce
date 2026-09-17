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
      data-open={open}
      style={{ paddingBlock: scrolled ? "14px" : "26px" }}
    >
      <a
        href="#home"
        onClick={onClose}
        className={`${s.mark} ${scrolled ? s.markScrolled : ""}`}
      >
        {/* White on transparent; inverted to black over light sections. */}
        <Image
          src="/brand/logo-fwrd-white.png"
          alt="SEKRATE SAUCE"
          width={88}
          height={84}
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

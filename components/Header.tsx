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
        className={s.mark}
        style={{ fontSize: scrolled ? "18px" : "22px" }}
      >
        SEKRATE SAUCE
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

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = ["English", "हिंदी"];

export default function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("English");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-toggle" ref={ref}>
      <button
        type="button"
        className="language-toggle-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span>{selected}</span>
        <ChevronDown size={15} />
      </button>

      {open && (
        <ul className="language-toggle-menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang}>
              <button
                type="button"
                role="option"
                aria-selected={selected === lang}
                className={selected === lang ? "active" : ""}
                onClick={() => {
                  setSelected(lang);
                  setOpen(false);
                }}
              >
                {lang}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

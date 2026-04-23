import {useEffect, useState} from "react";
import {FiArrowUp} from "react-icons/fi";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 480);

    handleScroll();
    window.addEventListener("scroll", handleScroll, {passive: true});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      aria-hidden={!isVisible}
      className={`fixed bottom-6 right-6 z-40 inline-flex size-12 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900 text-white shadow-lg shadow-emerald-950/20 transition duration-300 dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={() => window.scrollTo({behavior: "smooth", top: 0})}
      type="button"
    >
      <FiArrowUp className="size-5" />
    </button>
  );
}

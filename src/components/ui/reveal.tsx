import type {PropsWithChildren} from "react";
import {useEffect, useRef, useState} from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  delayClassName?: string;
}>;

export function Reveal({
  children,
  className = "",
  delayClassName = ""
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;

    if (!currentElement || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18
      }
    );

    observer.observe(currentElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${className} ${delayClassName} transition duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-6 opacity-0 blur-sm"
      }`.trim()}
      ref={elementRef}
    >
      {children}
    </div>
  );
}

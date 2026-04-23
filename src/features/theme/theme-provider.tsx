import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";

type ThemeContextValue = {
  isDark: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedValue === "dark" || storedValue === "light") {
    return storedValue;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({children}: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    const rootElement = document.documentElement;

    rootElement.classList.toggle("dark", theme === "dark");
    rootElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark: theme === "dark",
      theme,
      toggleTheme: () =>
        setTheme(currentTheme => (currentTheme === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

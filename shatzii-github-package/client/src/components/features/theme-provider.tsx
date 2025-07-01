import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light";
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "shatzii-theme",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [actualTheme, setActualTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (newTheme: "dark" | "light") => {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setActualTheme(newTheme);
    };

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(systemTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
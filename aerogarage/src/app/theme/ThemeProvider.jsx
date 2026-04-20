import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or fallback to system preference
    const stored = localStorage.getItem("amc-theme");
    if (stored) return stored;
    
    // Default to light if no preference is found
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    // We remove the old attribute if any
    if (theme === "dark") {
      root.setAttribute("data-theme", "amc-dark");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("amc-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

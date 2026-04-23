import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../app/theme/ThemeContext";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full p-2 text-(--amc-text-body) transition-colors hover:bg-(--amc-bg-main) hover:text-(--amc-text-strong) focus:outline-none focus:ring-2 focus:ring-(--amc-accent-500) ${className}`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

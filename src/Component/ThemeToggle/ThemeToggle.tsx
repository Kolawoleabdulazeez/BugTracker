import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-[#101222]">
        <Sun size={18} />
      </button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-[#101222] dark:text-white dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
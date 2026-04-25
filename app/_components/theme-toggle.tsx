"use client";

type ThemeMode = "light" | "dark";

const storageKey = "wfhs-theme";

type ThemeToggleProps = {
  compact?: boolean;
  onToggle?: () => void;
};

function getCurrentTheme(): ThemeMode {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export function ThemeToggle({ compact = false, onToggle }: ThemeToggleProps) {
  const toggleTheme = () => {
    const nextTheme: ThemeMode = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    onToggle?.();
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`.trim()}
      onClick={toggleTheme}
    >
      {compact ? "Toggle dark mode" : "Theme"}
    </button>
  );
}

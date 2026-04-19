"use client";

type ThemeMode = "light" | "dark";

const storageKey = "wfhs-theme";

function getCurrentTheme(): ThemeMode {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const toggleTheme = () => {
    const nextTheme: ThemeMode = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      Toggle theme
    </button>
  );
}

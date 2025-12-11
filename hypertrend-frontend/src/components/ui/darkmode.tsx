import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // optional icons

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDark(html.classList.contains("dark"));
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

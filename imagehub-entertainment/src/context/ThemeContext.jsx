import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    // Initial check: Get from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    // Apply the class to the root element for Tailwind 'dark:' utilities
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {/* Setting min-h-screen and a transition here ensures that 
         the background color wraps the whole app and changes smoothly 
      */}
      <div className={`min-h-screen transition-colors duration-500 ${dark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
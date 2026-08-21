"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const s = localStorage.getItem("mc_theme") as Theme | null;
    if (s === "dark" || s === "light") setTheme(s);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mc_theme", theme);
  }, [theme]);
  const toggle = () => setTheme(t => t === "light" ? "dark" : "light");
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

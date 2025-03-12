
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // On mount, check if theme is in localStorage or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-card/50 backdrop-blur-sm"
    >
      <motion.div
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;

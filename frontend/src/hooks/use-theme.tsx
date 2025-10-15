import { createContext, useContext, useEffect, useState } from 'react';

enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

interface ThemeContextData {
  theme: Themes;
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextData);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('');
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme === Themes.DARK) return Themes.DARK;
    return Themes.LIGHT;
  });

  useEffect(() => {
    const conditionDarkMode =
      localStorage.theme === Themes.DARK ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle(Themes.DARK, conditionDarkMode);
    localStorage.setItem('theme', conditionDarkMode ? Themes.DARK : Themes.LIGHT);
    setTheme(conditionDarkMode ? Themes.DARK : Themes.LIGHT);
  }, []);

  const toggleTheme = () => {
    if (localStorage.theme === Themes.DARK) {
      localStorage.theme = Themes.LIGHT;
      document.documentElement.classList.remove(Themes.DARK);
      setTheme(Themes.LIGHT);
    } else {
      localStorage.theme = Themes.DARK;
      document.documentElement.classList.add(Themes.DARK);
      setTheme(Themes.DARK);
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

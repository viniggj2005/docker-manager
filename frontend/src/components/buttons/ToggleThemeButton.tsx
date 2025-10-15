import { useTheme } from '../../hooks/use-theme';
import React, { useState, useEffect } from 'react';

const ToggleThemeButton: React.FC = () => {
  const theme = useTheme();
  const [delayedTheme, setDelayedTheme] = useState(theme.theme);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedTheme(theme.theme);
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme.theme]);

  return (
    <div
      onClick={theme.toggleTheme}
      className={`relative w-24 h-10 flex items-center cursor-pointer rounded-full transition-all shadow-md shadow-[var(--system-black)]
        ${theme.theme === 'dark' ? 'bg-[var(--dark-gray)] border-[var(--medium-gray)]' : 'bg-[var(--system-white)]'}`}
    >
      <div
        className={`absolute top-1/2 left-1 right-1 w-10 h-10 rounded-full  transition-transform duration-500
          -translate-y-1/2 ${theme.theme === 'dark' ? 'translate-x-1' : 'translate-x-12'}`}
      >
        <img
          className="w-full h-full"
          src={`/icons/${delayedTheme === 'dark' ? 'moon' : 'sun'}.svg`}
          alt="Theme Toggle"
        />
      </div>
    </div>
  );
};

export default ToggleThemeButton;

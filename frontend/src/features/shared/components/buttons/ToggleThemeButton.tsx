import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../hooks/use-theme';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

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
        className={`absolute top-1/2 left-1 right-1 w-10 h-10 rounded-full py-1  transition-transform duration-500
          -translate-y-1/2 ${theme.theme === 'dark' ? 'translate-x-1' : 'translate-x-14'}`}
      >
        {delayedTheme === 'dark' ? (
          <MdDarkMode className="h-8 w-8 text-[var(--system-white)]" />
        ) : (
          <MdLightMode className="h-8 w-8 text-var(--dark-primary)]" />
        )}
      </div>
    </div>
  );
};

export default ToggleThemeButton;

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
    <button
      onClick={theme.toggleTheme}
      className={`w-full p-1  rounded-lg border flex items-center justify-center transition-colors
        ${theme.theme === 'dark' ? 'bg-[var(--dark-gray)] border-[var(--medium-gray)]' : 'bg-[var(--system-white)]'}`}
    >
      {delayedTheme === 'dark' ? (
        <MdDarkMode className="h-8 w-8 text-[var(--system-white)]" />
      ) : (
        <MdLightMode className="h-8 w-8 text-var(--dark-primary)]" />
      )}
    </button>
  );
};

export default ToggleThemeButton;

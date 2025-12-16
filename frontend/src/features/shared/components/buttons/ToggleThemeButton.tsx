import { Moon, Sun } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../hooks/use-theme';

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
      className={`transition-all duration-200`}>
      <div className={`p-2 rounded-lg transition-all bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600`}>
        {delayedTheme === 'dark' ? (
          <Moon className="h-8 w-8 text-white" fill="currentColor" strokeWidth={0.8} />
        ) : (
          <Sun className="h-8 w-8 text-white" fill="currentColor" strokeWidth={1.5} />
        )}
      </div>
    </button>
  );
};

export default ToggleThemeButton;

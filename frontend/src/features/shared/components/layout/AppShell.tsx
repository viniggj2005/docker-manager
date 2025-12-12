import React, { useState } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import Sidebar from './Sidebar';
import ToggleThemeButton from '../buttons/ToggleThemeButton';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-white text-black transition-colors duration-200 dark:bg-zinc-900 dark:text-white">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-800 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-500 transition hover:bg-white/60 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            aria-label="Abrir menu"
          >
            <HiOutlineMenuAlt3 className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
            Docker Manager
          </span>
          <ToggleThemeButton />
        </header>

        <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;

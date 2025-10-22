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
    <div className="relative flex min-h-screen bg-[var(--system-white)] text-[var(--system-black)] transition-colors duration-200 dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="flex items-center justify-between border-b border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-3 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center rounded-lg border border-[var(--light-gray)] bg-[var(--system-white)] p-2 text-[var(--medium-gray)] transition hover:bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]"
            aria-label="Abrir menu"
          >
            <HiOutlineMenuAlt3 className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
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

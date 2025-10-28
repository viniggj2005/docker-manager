import Sidebar from './Sidebar';
import React, { useState } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { AppShellProps } from '../../../../interfaces/SharedInterfaces';

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const desktopPadding = isSidebarCollapsed ? 'lg:pl-24 xl:pl-28' : 'lg:pl-72';

  return (
    <div className="relative flex min-h-screen bg-[var(--system-white)] text-[var(--system-black)] transition-colors duration-200 dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
      <Sidebar
        open={isSidebarOpen}
        collapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <div
        className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-200 ${desktopPadding}`}
      >
        <div className="px-4 pt-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-2 text-sm font-medium text-[var(--medium-gray)] transition hover:bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]"
            aria-label="Abrir menu lateral"
            type="button"
          >
            <HiOutlineMenuAlt3 className="h-5 w-5" />
            Menu
          </button>
        </div>

        <main className="flex flex-1 flex-col px-4 pb-6 pt-0 sm:px-6 sm:pt-0 lg:px-8 lg:pt-6 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;

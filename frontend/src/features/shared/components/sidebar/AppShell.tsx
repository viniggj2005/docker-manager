import Sidebar from './Sidebar';
import React, { useState } from 'react';
import { AppShellProps } from '../../../../interfaces/SharedInterfaces';

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative flex h-full min-h-0">
      <Sidebar
        open={isSidebarOpen}
        collapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />


      <main className=" flex-1 min-h-0 flex flex-col px-4 pb-6 pt-0 sm:px-6 sm:pt-0 lg:px-8 lg:pt-6 xl:px-10 overflow-auto bg-gradient-to-br dark:from-blue-500/20 dark:to-purple-500/20 from-blue-500/10 to-purple-500/10 transition-colors duration-200 dark:bg-zinc-900">
        {children}
      </main>
    </div>
  );
};

export default AppShell;

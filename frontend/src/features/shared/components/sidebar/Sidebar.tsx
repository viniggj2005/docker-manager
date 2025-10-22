import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineServer,
  HiOutlineX,
} from 'react-icons/hi';
import ToggleThemeButton from '../buttons/ToggleThemeButton';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navItems = [
  {
    label: 'Painel',
    description: 'Visão geral dos containers',
    to: '/home',
    icon: HiOutlineHome,
  },
  {
    label: 'Conexões SSH',
    description: 'Acesse servidores remotos',
    to: '/createConnectionForm',
    icon: HiOutlineServer,
  },
  {
    label: 'Entrar',
    description: 'Gerencie suas credenciais',
    to: '/login',
    icon: HiOutlineLogout,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, collapsed, onClose, onToggleCollapse }) => {
  const desktopWidthClass = collapsed ? 'lg:w-24 xl:w-28' : 'lg:w-72';

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[var(--dark-overlay)] transition-opacity duration-200 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col overflow-y-auto bg-[var(--system-white)] px-6 py-8 text-[var(--system-black)] shadow-xl transition-transform duration-200 dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:px-4' : 'lg:px-6'} ${desktopWidthClass}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`hidden h-12 w-12 items-center justify-center rounded-2xl border border-[var(--light-gray)] text-lg font-semibold text-[var(--docker-blue)] dark:border-[var(--dark-tertiary)] dark:text-[var(--docker-blue)] lg:flex ${
                collapsed ? '' : 'lg:hidden'
              }`}
            >
              DM
            </div>
            <div className={`${collapsed ? 'lg:hidden' : ''}`}>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
              Docker Manager
            </span>
            <h1 className="mt-2 text-2xl font-semibold">Painel</h1>
          </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--light-gray)] text-[var(--medium-gray)] transition hover:bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)] lg:hidden"
            aria-label="Fechar menu"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--light-gray)] text-[var(--medium-gray)] transition hover:bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)] lg:inline-flex"
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <HiOutlineChevronRight className="h-5 w-5" /> : <HiOutlineChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav
          className={`mt-10 flex flex-1 flex-col gap-2 ${collapsed ? 'lg:items-center lg:gap-3' : ''}`}
          aria-label="Menu principal"
        >
          {navItems.map(({ label, description, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl border border-transparent bg-transparent px-4 py-3 transition hover:border-[var(--light-gray)] hover:bg-[var(--light-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docker-blue)] dark:hover:border-[var(--dark-tertiary)] dark:hover:bg-[var(--dark-tertiary)] ${
                  collapsed ? 'lg:w-full lg:justify-center lg:px-2' : ''
                } ${
                  isActive
                    ? 'border-[var(--docker-blue)] bg-[var(--light-overlay)] text-[var(--docker-blue)] dark:border-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)]'
                    : 'text-[var(--medium-gray)] dark:text-[var(--grey-text)]'
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--light-gray)] text-lg transition group-hover:border-[var(--docker-blue)] group-hover:text-[var(--docker-blue)] dark:border-[var(--dark-tertiary)]">
                <Icon className="h-5 w-5" />
              </span>
              <div className={`flex flex-col ${collapsed ? 'lg:hidden' : ''}`}>
                <span className="font-semibold text-current">{label}</span>
                <span className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">{description}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div
          className={`mt-6 rounded-xl border border-[var(--light-gray)] bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-tertiary)] ${
            collapsed ? 'lg:flex lg:flex-col lg:items-center lg:gap-2 lg:p-3' : 'p-4'
          }`}
        >
          <h2
            className={`text-sm font-semibold text-[var(--system-black)] dark:text-[var(--system-white)] ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Tema
          </h2>
          <p
            className={`mt-1 text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)] ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Alterne entre os modos claro e escuro para personalizar sua experiência.
          </p>
          <div className={`mt-3 ${collapsed ? 'lg:mt-0' : ''}`}>
            <ToggleThemeButton />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

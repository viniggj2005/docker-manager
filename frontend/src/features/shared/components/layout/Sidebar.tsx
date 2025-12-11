import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineServer, HiOutlineLogout, HiOutlineX } from 'react-icons/hi';
import ToggleThemeButton from '../buttons/ToggleThemeButton';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[var(--dark-overlay)] transition-opacity duration-200 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col overflow-y-auto bg-[var(--system-white)] px-6 py-8 shadow-xl transition-transform duration-200 dark:bg-[var(--dark-secondary)] lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
              Docker Manager
            </span>
            <h1 className="mt-2 text-2xl font-semibold">Painel</h1>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--light-gray)] text-[var(--medium-gray)] transition hover:bg-[var(--light-overlay)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)] lg:hidden"
            aria-label="Fechar menu"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2" aria-label="Menu principal">
          {navItems.map(({ label, description, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group rounded-xl border border-transparent bg-transparent px-4 py-3 transition hover:border-[var(--light-gray)] hover:bg-[var(--light-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docker-blue)] dark:hover:border-[var(--dark-tertiary)] dark:hover:bg-[var(--dark-tertiary)] ${isActive
                  ? 'border-[var(--docker-blue)] bg-[var(--light-overlay)] text-[var(--docker-blue)] dark:border-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)]'
                  : 'text-[var(--medium-gray)] dark:text-[var(--grey-text)]'
                }`
              }
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--light-gray)] text-lg transition group-hover:border-[var(--docker-blue)] group-hover:text-[var(--docker-blue)] dark:border-[var(--dark-tertiary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-current">{label}</span>
                  <span className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
                    {description}
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-xl border border-[var(--light-gray)] bg-[var(--light-overlay)] p-4 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-tertiary)]">
          <h2 className="text-sm font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
            Tema
          </h2>
          <p className="mt-1 text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Alterne entre os modos claro e escuro para personalizar sua experiência.
          </p>
          <div className="mt-3">
            <ToggleThemeButton />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

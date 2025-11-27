import React from 'react';
import { useNavigate } from 'react-router-dom';
import appIcon from '../assets/images/appicon.png';
import LoginForm from '../features/login/LoginForm';
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--dark-primary)] via-[var(--dark-secondary)] to-[var(--system-black)] px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--docker-blue)_0,transparent_60%)] opacity-40" />
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-[var(--dark-tertiary)] bg-[var(--system-white)]/90 shadow-2xl backdrop-blur dark:bg-[var(--dark-secondary)]/90">
        <div className="grid gap-0 lg:grid-cols-[1.1fr,1fr]">
          <div className="hidden flex-col justify-between bg-[var(--system-black)]/70 p-10 text-[var(--system-white)] lg:flex">
            <div className="space-y-6 mb-4">
              <div>
                <div className="flex">
                  <img src={appIcon} alt="Docker Manager" className="h-20 w-20 object-contain" />
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--docker-blue)]/20 px-3 py-1 text-sm font-medium uppercase tracking-wide text-[var(--docker-blue)]">
                    Docker Manager
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-tight">
                  Gerencie containers com agilidade e clareza
                </h1>
                <p className="mt-4 max-w-md text-base text-[var(--text-gray)]">
                  Acompanhe métricas em tempo real, visualize logs e tenha controle total sobre os
                  seus ambientes Docker.
                </p>
              </div>

              <ul className="space-y-4 text-sm text-[var(--text-gray)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--docker-blue)]" />
                  Monitoramento contínuo dos containers.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--docker-blue)]" />
                  Visualização clara de logs, portas expostas e status em tempo real.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--docker-blue)]" />
                  Design responsivo pensado para ambientes de trabalho modernos.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--dark-tertiary)] bg-[var(--dark-tertiary)] p-6 text-sm text-[var(--system-white)]">
              <p>
                Precisa de uma conta?{' '}
                <span
                  className="text-[var(--docker-blue)] ml-1 cursor-pointer"
                  onClick={() => {
                    navigate('/create-account');
                  }}
                >
                  criar conta
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col   justify-center gap-10 p-8 sm:p-12">
            <div className="mx-auto  rounded-2xl border border-[var(--light-gray)]/70 bg-[var(--system-white)] p-8 shadow-xl dark:border-[var(--dark-tertiary)]/50 dark:bg-[var(--dark-primary)]/60">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

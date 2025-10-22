import React from 'react';
import LoginForm from '../features/login/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-8 shadow-lg dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">Acesse sua conta</h1>
          <p className="mt-2 text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Faça login para continuar gerenciando containers e conexões.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;

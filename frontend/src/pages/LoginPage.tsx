import React from 'react';
import LoginForm from '../features/login/LoginForm';
import ToggleThemeButton from '../features/shared/buttons/ToggleThemeButton';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--system-white)] dark:bg-[var(--dark-primary)] p-6">
      <div className="shadow-md shadow-[var(--dark-primary)] dark:shadow-[var()]  rounded-xl bg-[var(--system-white)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] p-6">
        <LoginForm />
      </div>
      <div className="absolute bottom-4">
        <ToggleThemeButton />
      </div>
    </div>
  );
};
export default LoginPage;

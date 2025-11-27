import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TextField from './components/fields/TextField';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordField from './components/fields/PasswordField';

const LoginForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { login, loading, error } = useAuth();
  const [password, setPassword] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await login(email.trim(), password);
    const goTo = (location.state as any)?.from?.pathname || '/home';
    navigate(goTo, { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="grid h-full gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--system-black)]">Faça login</h2>
        <p className="mt-1 text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Utilize suas credenciais para acessar o painel.
        </p>
      </div>

      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        placeholder="seu@email.com"
        onChange={(event) => setEmail(event.target.value)}
      />

      <PasswordField
        label="Senha"
        name="password"
        value={password}
        placeholder="••••••••"
        onChange={(event) => setPassword(event.target.value)}
      />

      {error ? <div className="text-sm text-[var(--exit-red)]">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--dark-primary)] px-4 py-2 text-base font-semibold text-[var(--system-white)] transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};
export default LoginForm;

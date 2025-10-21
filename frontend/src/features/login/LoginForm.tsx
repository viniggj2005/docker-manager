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
    <form onSubmit={onSubmit} className="w-80 grid gap-3 ">
      <h2 className="mb-2 text-xl font-semibold">Entrar</h2>

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
        className="w-full rounded-md hover:scale-95 bg-[var(--dark-primary)] px-4 py-2 font-semibold text-[var(--system-white)] disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};
export default LoginForm;

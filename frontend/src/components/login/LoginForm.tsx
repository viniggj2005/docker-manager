import React, { useState } from 'react';
import TextField from './fileds/TextField';
import PasswordField from './fileds/PasswordField';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email.trim(), password);
    const to = (location.state as any)?.from?.pathname || '/home';
    navigate(to, { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="w-[340px] grid gap-3">
      <h2 className="mb-2 text-xl font-semibold">Entrar</h2>

      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />

      <PasswordField
        label="Senha"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

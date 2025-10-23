import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../../login/components/fields/TextField';
import PasswordField from '../../../login/components/fields/PasswordField';
import { createUserApi, type CreateUserPayload } from '../../services/CreateUser';

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function resetFeedback() {
    setError(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas informadas não conferem.');
      return;
    }

    const payload: CreateUserPayload = {
      name: fullName.trim(),
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);
      await createUserApi(payload);
      setSuccessMessage('Conta criada com sucesso! Você já pode fazer login.');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : 'Não foi possível criar a conta. Tente novamente mais tarde.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--system-black)] ">Criar conta</h2>
        <p className="mt-1 text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Informe seus dados para se cadastrar no Docker Manager.
        </p>
      </div>

      <TextField
        label="Nome completo"
        name="fullName"
        value={fullName}
        placeholder="Seu nome"
        onChange={(event) => setFullName(event.target.value)}
        required
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        placeholder="seu@email.com"
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <PasswordField
        label="Senha"
        name="password"
        value={password}
        placeholder="••••••••"
        onChange={(event) => setPassword(event.target.value)}
      />

      <PasswordField
        label="Confirmar senha"
        name="confirmPassword"
        value={confirmPassword}
        placeholder="••••••••"
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      {error ? <div className="text-sm text-[var(--exit-red)]">{error}</div> : null}
      {successMessage ? (
        <div className="text-sm text-[var(--success-green)]">{successMessage}</div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--docker-blue)] px-4 py-2 text-base font-semibold text-[var(--system-white)] transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--dark-tertiary)] px-4 py-2 text-base font-semibold text-[var(--dark-primary)] transition hover:scale-[0.99] dark:border-[var(--grey-text)]"
        >
          Voltar para o login
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;

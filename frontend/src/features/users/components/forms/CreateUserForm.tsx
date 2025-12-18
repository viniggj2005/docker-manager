import iziToast from 'izitoast';
import { motion } from 'framer-motion';
import 'izitoast/dist/css/iziToast.min.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createUserApi } from '../../services/UserService';
import { Mail, User, Lock, EyeClosed, Eye, Check } from 'lucide-react';
import { CreateUserPayload } from '../../../../interfaces/UsersInterface';

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ hasLength: boolean; hasNumber: boolean; hasSpecial: boolean; hasUpperCase: boolean; strength: number } | null>(null);

  useEffect(() => {
    setPasswordStrength(getPasswordStrength());
  }, [password]);

  const getPasswordStrength = () => {
    if (!password) return null;
    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    const strength = [hasLength, hasNumber, hasSpecial, hasUpperCase].filter(Boolean).length;
    return { hasLength, hasNumber, hasSpecial, hasUpperCase, strength };
  };


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      iziToast.warning({
        title: 'Atenção',
        message: 'Preencha todos os campos obrigatórios.',
        position: 'bottomRight'
      });
      return;
    }

    if (password !== confirmPassword) {
      iziToast.warning({
        title: 'Atenção',
        message: 'As senhas informadas não conferem.',
        position: 'bottomRight'
      });
      return;
    }
    const strength = getPasswordStrength();
    setPasswordStrength(strength);

    if (!strength || strength.strength < 4) {
      iziToast.warning({
        title: 'Senha Fraca',
        message: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, números e caracteres especiais.',
        position: 'bottomRight'
      });
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
      iziToast.success({
        title: 'Sucesso',
        message: 'Conta criada com sucesso! Redirecionando...',
        position: 'bottomRight',
        onClosing: () => navigate('/login'),
      });
    } catch (createError: any) {
      iziToast.error({
        title: 'Erro',
        message: createError.message || 'Não foi possível criar a conta.',
        position: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-purple-100">
          Nome completo
        </label>
        <div className="relative">
          <User className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/50" />
          <input
            type="text"
            placeholder="Seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-purple-100">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/50" />
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-purple-100">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/50" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/70 hover:text-purple-200 transition-colors"
          >
            {showPassword ? (
              <EyeClosed className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {passwordStrength && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 pt-2"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength.strength
                    ? passwordStrength.strength <= 2
                      ? 'bg-red-400'
                      : passwordStrength.strength === 3
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    : 'bg-white/20'
                    }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-green-300' : 'text-white/50'}`}>
                <Check className="w-3 h-3" />
                <span>8+ caracteres</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-300' : 'text-white/50'}`}>
                <Check className="w-3 h-3" />
                <span>Número</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-300' : 'text-white/50'}`}>
                <Check className="w-3 h-3" />
                <span>Maiúscula</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-green-300' : 'text-white/50'}`}>
                <Check className="w-3 h-3" />
                <span>Especial</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-purple-100">
          Confirmar senha
        </label>
        <div className="relative">
          <Lock className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/50" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/70 hover:text-purple-200 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeClosed className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-300 text-xs flex items-center gap-1">
            <span>⚠</span> As senhas não coincidem
          </p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all relative overflow-hidden group mt-6"
      >
        <span className="relative z-10">Criar conta</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </form>
  );
};

export default CreateUserForm;

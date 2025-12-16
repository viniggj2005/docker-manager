import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeClosed } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await login(email.trim(), password);
    const goTo = (location.state as any)?.from?.pathname || '/home';
    navigate(goTo, { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm text-blue-100">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-blue-100">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/70 hover:text-blue-200 transition-colors"
          >
            {showPassword ? (
              <EyeClosed className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all relative overflow-hidden group"
      >
        <span className="relative z-10">Entrar</span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </form>
  );
};
export default LoginForm;

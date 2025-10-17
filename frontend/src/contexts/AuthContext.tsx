import { EventsOn } from '../../wailsjs/runtime/runtime';
import { loginApi, logoutApi } from '../components/login/Auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserDTO = { id: number; nome: string; email: string };
type LoginResponse = { token: string; user: UserDTO };

type AuthContextType = {
  loading: boolean;
  token: string | null;
  user: UserDTO | null;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let tokenRef: { current: string | null } = { current: null };
export const getToken = () => tokenRef.current;

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: LoginResponse = await loginApi(email, password);
      setToken(res.token);
      setUser(res.user);
      tokenRef.current = res.token;
    } catch (e: any) {
      setError(e?.message ?? 'Falha no login');
      setToken(null);
      setUser(null);
      tokenRef.current = null;
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) await logoutApi(token);
    } finally {
      setToken(null);
      setUser(null);
      tokenRef.current = null;
      setError(null);
    }
  };

  useEffect(() => {
    const off = EventsOn('auth:changed', (isLogged: boolean) => {
      if (!isLogged) {
        setToken(null);
        setUser(null);
        tokenRef.current = null;
      }
    });
    return () => {
      if (typeof off === 'function') off();
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      error,
      login,
      logout,
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

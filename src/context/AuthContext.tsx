import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../api/client';
import { AuthUser } from '../api/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const { token, fullName, email: userEmail, role } = res.data;
    localStorage.setItem('token', token);
    const authUser: AuthUser = { fullName, email: userEmail, role };
    localStorage.setItem('user', JSON.stringify(authUser));
    setUser(authUser);
  }

  async function register(fullName: string, email: string, password: string) {
    const res = await api.post('/auth/register', { fullName, email, password });
    const { token, email: userEmail, role } = res.data;
    localStorage.setItem('token', token);
    const authUser: AuthUser = { fullName, email: userEmail, role };
    localStorage.setItem('user', JSON.stringify(authUser));
    setUser(authUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

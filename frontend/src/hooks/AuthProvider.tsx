import React, { useState } from 'react';
import { loginUser, registerUser } from '../api/auth.api';
import { AuthContext } from './AuthContext';
import type { LoginDTO, RegisterDTO, User } from '../types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState<boolean>(false);

  const login = async (data: LoginDTO) => {
    const res = await loginUser(data);
    if (res.data) {
      setToken(res.data.accessToken);
      setUser(res.data.user);
      localStorage.setItem('access_token', res.data.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
    }
  };

  const register = async (data: RegisterDTO) => {
    const res = await registerUser(data);
    if (res.data) {
      setToken(res.data.accessToken);
      setUser(res.data.user);
      localStorage.setItem('access_token', res.data.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

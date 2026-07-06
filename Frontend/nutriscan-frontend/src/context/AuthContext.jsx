import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    await refreshUser();
    return data;
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    await refreshUser();
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateHealthProfile = async (payload) => {
    const updated = await authApi.updateHealthProfile(payload);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, updateHealthProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

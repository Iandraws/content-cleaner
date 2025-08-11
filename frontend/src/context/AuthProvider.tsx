import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import { ping } from '../api/authApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      if (!token) {
        if (!cancelled) {
          setIsLoggedIn(false);
          setIsInitialized(true);
        }
        return;
      }

      const isValid = await ping();
      if (cancelled) {
        return;
      }

      if (!isValid) {
        localStorage.removeItem('access_token');

        setToken(null);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setIsInitialized(true);
    };

    initializeAuth();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const storeToken = useCallback((t: string) => {
    try {
      localStorage.setItem('access_token', t);
    } finally {
      setToken(t);
      setIsLoggedIn(true);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('access_token');
    } finally {
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({ isLoggedIn, isInitialized, storeToken, logout }),
    [isLoggedIn, isInitialized, storeToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'));

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  const login = (userData, token) => {
    setUser(userData);
    if (token) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

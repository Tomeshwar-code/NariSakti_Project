// import React, { createContext, useState, useEffect } from 'react';
// import { STORAGE_KEYS } from '../constants/storageKeys';

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'));

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
//     } else {
//       localStorage.removeItem(STORAGE_KEYS.USER);
//     }
//   }, [user]);

//   const login = (userData, token) => {
//     setUser(userData);
//     if (token) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Optional helper: decode JWT without a library (for expiry check)
// Replace with real jwt-decode if you install the package
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true; // no exp claim = treat as expired
  return Date.now() >= decoded.exp * 1000;
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Check token validity on mount and when user changes
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && isTokenExpired(token)) {
      console.warn('Token expired, logging out');
      logout();
    }
  }, [user]); // re-check when user state flips

  // Optional: refresh token on activity (you can add a refresh mechanism later)
  const login = useCallback((userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // If you store refresh token, remove it as well
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  // Derived state: is user authenticated + token present?
  const isAuthenticated = !!user && !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const value = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming the context safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
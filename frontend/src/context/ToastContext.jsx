import React, { createContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const showToast = (message, type = 'info', options = {}) => {
    if (type === 'success') toast.success(message, options);
    else if (type === 'error') toast.error(message, options);
    else if (type === 'warn' || type === 'warning') toast.warn(message, options);
    else toast.info(message, options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

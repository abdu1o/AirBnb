// context/AuthContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Ошибка при восстановлении сессии:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        toast.error('Помилка при виході');
      } else {
        setUser(null);
        toast.success('Ви вийшли з системи');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Помилка при виході');
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

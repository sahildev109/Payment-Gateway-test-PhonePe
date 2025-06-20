
import { createContext, useState, useEffect } from 'react';
import authService from '../services/AuthServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.checkAuth();
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
       await authService.login(credentials); // No need to directly set user from here
    const data = await authService.checkAuth(); // Verify with the server session
    if (data.isAuthenticated) {
        setUser(data.user);
    }
    return data;

  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
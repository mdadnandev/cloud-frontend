import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('drive_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('drive_user');
    const savedToken = localStorage.getItem('drive_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: jwt } = res.data;
    localStorage.setItem('drive_token', jwt);
    
    // Decode basic user info from JWT payload
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const userData = { email: payload.sub, name: email.split('@')[0] };
    localStorage.setItem('drive_user', JSON.stringify(userData));
    
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token: jwt } = res.data;
    localStorage.setItem('drive_token', jwt);
    
    const userData = { name, email };
    localStorage.setItem('drive_user', JSON.stringify(userData));
    
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('drive_token');
    localStorage.removeItem('drive_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

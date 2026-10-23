// ============================================================
// Auth Context — Stage 1: Local state mock authentication
// Stage 2: Replace with JWT + real API
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react';
import { CURRENT_USER, ADMIN_USER, MOCK_CREDENTIALS } from '../data/mockData/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('verifai_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email, password) => {
    // Stage 1: mock authentication
    if (email === MOCK_CREDENTIALS.admin.email && password === MOCK_CREDENTIALS.admin.password) {
      const adminUser = { ...ADMIN_USER };
      setUser(adminUser);
      localStorage.setItem('verifai_user', JSON.stringify(adminUser));
      return { success: true, role: 'admin' };
    }
    if (email === MOCK_CREDENTIALS.user.email && password === MOCK_CREDENTIALS.user.password) {
      const normalUser = { ...CURRENT_USER };
      setUser(normalUser);
      localStorage.setItem('verifai_user', JSON.stringify(normalUser));
      return { success: true, role: 'user' };
    }
    // For demo, allow any email/password combo as user
    if (email && password.length >= 6) {
      const demoUser = { ...CURRENT_USER, email, name: email.split('@')[0] };
      setUser(demoUser);
      localStorage.setItem('verifai_user', JSON.stringify(demoUser));
      return { success: true, role: 'user' };
    }
    return { success: false, error: 'Invalid credentials. Try: manthan@example.com / password123' };
  }, []);

  const register = useCallback(async (name, email, password) => {
    const newUser = { ...CURRENT_USER, name, email, id: `u_${Date.now()}` };
    setUser(newUser);
    localStorage.setItem('verifai_user', JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('verifai_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

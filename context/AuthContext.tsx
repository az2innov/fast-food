
import React, { createContext, useState, useContext } from 'react';
import { User, AuthContextType, ChildrenProp } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<ChildrenProp> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: 'customer' | 'admin') => {
    setUser({ id: `user-${Date.now()}`, name, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

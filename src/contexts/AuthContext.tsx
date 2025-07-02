import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (citizenId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    citizenId: '079123456789',
    name: 'Nguyễn Văn Admin',
    email: 'admin@fremed.com',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    citizenId: '079987654321',
    name: 'Trần Thị Manager',
    email: 'manager@fremed.com',
    role: 'manager',
    department: 'Sales',
    position: 'Sales Manager',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    citizenId: '079555666777',
    name: 'Lê Văn Employee',
    email: 'employee@fremed.com',
    role: 'employee',
    department: 'Warehouse',
    position: 'Warehouse Staff',
    isActive: true,
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fremed_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (citizenId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.citizenId === citizenId);
    
    if (foundUser && password === '123456') { // Mock password
      setUser(foundUser);
      localStorage.setItem('fremed_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fremed_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
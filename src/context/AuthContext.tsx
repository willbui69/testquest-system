
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const mockUsers: Record<UserRole, User> = {
  sales: {
    id: 'sales-1',
    name: 'Alex Sales',
    email: 'sales@example.com',
    role: 'sales'
  },
  reception: {
    id: 'reception-1',
    name: 'Robin Reception',
    email: 'reception@example.com',
    role: 'reception'
  },
  tester: {
    id: 'tester-1',
    name: 'Taylor Tester',
    email: 'tester@example.com',
    role: 'tester'
  },
  manager: {
    id: 'manager-1',
    name: 'Morgan Manager',
    email: 'manager@example.com',
    role: 'manager'
  },
  customer: {
    id: 'customer-1',
    name: 'Casey Customer',
    email: 'customer@example.com',
    role: 'customer'
  }
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  switchRole: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage (simulating persistence)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock login logic
      const rolePart = email.split('@')[0];
      const role = rolePart as UserRole;
      
      if (mockUsers[role]) {
        setCurrentUser(mockUsers[role]);
        localStorage.setItem('currentUser', JSON.stringify(mockUsers[role]));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // For demo purposes - easily switch between roles
  const switchRole = (role: UserRole) => {
    if (mockUsers[role]) {
      setCurrentUser(mockUsers[role]);
      localStorage.setItem('currentUser', JSON.stringify(mockUsers[role]));
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    switchRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

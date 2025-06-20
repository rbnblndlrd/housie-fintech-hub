
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'customer' | 'provider';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    // Get role from localStorage or default to customer
    const savedRole = localStorage.getItem('housie-user-role');
    return (savedRole as UserRole) || 'customer';
  });

  useEffect(() => {
    // Save role to localStorage whenever it changes
    localStorage.setItem('housie-user-role', currentRole);
  }, [currentRole]);

  const toggleRole = () => {
    setCurrentRole(prev => prev === 'customer' ? 'provider' : 'customer');
  };

  const value = {
    currentRole,
    setCurrentRole,
    toggleRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

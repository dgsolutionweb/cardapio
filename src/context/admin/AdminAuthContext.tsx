import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../../types';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tipos para o contexto
interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Valor padrão do contexto
const defaultContext: AdminAuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
};

// Criar o contexto
const AdminAuthContext = createContext<AdminAuthContextType>(defaultContext);

// Props para o provider
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Hook personalizado para usar o contexto
export const useAdminAuth = () => useContext(AdminAuthContext);

// Provider component
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Função de login
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }
      
      const userData = await response.json();
      
      // Salvar usuário no localStorage
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      // Atualizar o estado
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valor do contexto
  const contextValue: AdminAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext; 
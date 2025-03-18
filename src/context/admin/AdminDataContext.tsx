import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Product, Order, AdminDataContextType, StoreSettings } from '../../types';
import { useAdminAuth } from './AdminAuthContext';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Valor padrão do contexto
const defaultContext: AdminDataContextType = {
  categories: [],
  products: [],
  orders: [],
  settings: null,
  isLoading: false,
  error: null,
  fetchCategories: async () => [],
  fetchProducts: async () => [],
  fetchOrders: async () => [],
  fetchSettings: async () => ({} as StoreSettings),
  addCategory: async () => null,
  updateCategory: async () => false,
  deleteCategory: async () => false,
  toggleCategoryStatus: async () => false,
  addProduct: async () => null,
  updateProduct: async () => false,
  deleteProduct: async () => false,
  toggleProductStatus: async () => false,
  updateOrderStatus: async () => false,
  updateSetting: async () => false,
  updateSettings: async () => false,
};

// Criar o contexto
const AdminDataContext = createContext<AdminDataContextType>(defaultContext);

// Props para o provider
interface AdminDataProviderProps {
  children: ReactNode;
}

// Hook personalizado para usar o contexto
export const useAdminData = () => useContext(AdminDataContext);

// Provider component
export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAdminAuth();

  // Função para fazer requisições autenticadas
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao acessar ${endpoint}`);
      }
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      setError(error instanceof Error ? error.message : 'Erro na requisição');
      throw error;
    }
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchOrders(),
        fetchSettings()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isAuthenticated]);

  // Funções para gerenciar categorias
  const fetchCategories = async (): Promise<Category[]> => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/categories');
      setCategories(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
    setIsLoading(true);
    try {
      const newCategory = await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
      );
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${id}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/categories/${id}`, {
        method: 'DELETE',
      });
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (error) {
      console.error(`Erro ao excluir categoria ${id}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryStatus = async (id: number): Promise<boolean> => {
    const category = categories.find(c => c.id === id);
    if (!category) return false;
    
    return await updateCategory(id, { active: !category.active });
  };

  // Funções para gerenciar produtos
  const fetchProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/products');
      setProducts(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const newProduct = await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      
      if (newProduct) {
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setProducts(prev => 
        prev.map(prod => prod.id === id ? { ...prod, ...updates } : prod)
      );
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/products/${id}`, {
        method: 'DELETE',
      });
      
      setProducts(prev => prev.filter(prod => prod.id !== id));
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductStatus = async (id: number): Promise<boolean> => {
    const product = products.find(p => p.id === id);
    if (!product) return false;
    
    return await updateProduct(id, { active: !product.active });
  };

  // Funções para gerenciar pedidos
  const fetchOrders = async (): Promise<Order[]> => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/orders');
      setOrders(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: Order['status']): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      setOrders(prev => 
        prev.map(order => order.id === id ? { ...order, status } : order)
      );
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${id}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para gerenciar configurações
  const fetchSettings = async (): Promise<StoreSettings> => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/settings');
      setSettings(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return {} as StoreSettings;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (name: string, value: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetchApi(`/settings/${name}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });
      
      // Atualizar o estado local
      setSettings(prev => {
        if (!prev) return { [name]: value } as StoreSettings;
        return { ...prev, [name]: value };
      });
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar configuração ${name}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const promises = Object.entries(updates).map(([name, value]) => 
        fetchApi(`/settings/${name}`, {
          method: 'PUT',
          body: JSON.stringify({ value }),
        })
      );
      
      await Promise.all(promises);
      
      // Atualizar o estado local
      setSettings(prev => {
        if (!prev) return updates as StoreSettings;
        return { ...prev, ...updates };
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto
  const contextValue: AdminDataContextType = {
    categories,
    products,
    orders,
    settings,
    isLoading,
    error,
    fetchCategories,
    fetchProducts,
    fetchOrders,
    fetchSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateOrderStatus,
    updateSetting,
    updateSettings,
  };

  return (
    <AdminDataContext.Provider value={contextValue}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminDataContext; 
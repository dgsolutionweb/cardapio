import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, CartItem, CartContextType, Order } from '../types';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async (customerName: string, customerPhone: string, customerAddress: string): Promise<Order | null> => {
    setIsLoading(true);
    setOrderError(null);
    
    try {
      const orderData = {
        customerName,
        customerPhone,
        customerAddress,
        items: cart,
        total: getTotal(),
      };
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar pedido');
      }
      
      const newOrder = await response.json();
      
      // Limpar o carrinho após criar o pedido com sucesso
      clearCart();
      
      return newOrder;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setOrderError(error instanceof Error ? error.message : 'Erro ao criar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getTotal, 
      getTotalItems,
      createOrder,
      isLoading,
      orderError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}; 
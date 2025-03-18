import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/admin/AdminAuthContext';
import { AdminDataProvider } from './context/admin/AdminDataContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import SettingsPage from './pages/admin/SettingsPage';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff5f7;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  background-color: #f8e8e8;
  padding: 1.5rem;
  text-align: center;
  color: #666;
  border-top: 1px solid #eee;
`;

// Componente de layout para a loja
const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppContainer>
    <Header />
    <MainContent>{children}</MainContent>
  </AppContainer>
);

function App() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Rotas do Admin */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Alias para página de login do admin */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas da Loja */}
              <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
              <Route path="/menu" element={<StoreLayout><MenuPage /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
            </Routes>
          </Router>
        </CartProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default App;

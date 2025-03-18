import React from 'react';
import styled from 'styled-components';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';

const LayoutContainer = styled.div`
  display: flex;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const AdminLayout: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <LayoutContainer>
      <Sidebar />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </LayoutContainer>
  );
};

export default AdminLayout; 
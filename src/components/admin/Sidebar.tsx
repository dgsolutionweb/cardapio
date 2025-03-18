import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaBox, FaShoppingBag, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { IconRenderer } from '../../utils/IconRenderer';

const SidebarContainer = styled.aside`
  background-color: #2c3e50;
  width: 250px;
  min-height: 100vh;
  color: white;
  padding: 1rem 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  border-bottom: 1px solid #3c546a;
  color: #e74c3c;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 0.2rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #34495e;
    color: #e74c3c;
  }
  
  &.active {
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
      color: white;
    }
  }
  
  svg {
    margin-right: 0.8rem;
    font-size: 1.2rem;
  }
`;

const UserInfo = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #3c546a;
  margin-top: auto;
  position: absolute;
  bottom: 70px;
  width: 100%;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
`;

const UserRole = styled.p`
  margin: 0.2rem 0 0 0;
  font-size: 0.8rem;
  color: #bdc3c7;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  text-align: left;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: background-color 0.3s;
  font-size: 1rem;
  
  &:hover {
    background-color: #34495e;
  }
  
  svg {
    margin-right: 0.8rem;
    font-size: 1.2rem;
  }
`;

const Sidebar: React.FC = () => {
  const { user, logout } = useAdminAuth();
  
  return (
    <SidebarContainer>
      <Logo>Sweet Admin</Logo>
      
      <Menu>
        <MenuItem>
          <StyledNavLink to="/admin/dashboard">
            <IconRenderer icon={FaHome} size={18} />
            Dashboard
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/admin/categories">
            <IconRenderer icon={FaList} size={18} />
            Categorias
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/admin/products">
            <IconRenderer icon={FaBox} size={18} />
            Produtos
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/admin/orders">
            <IconRenderer icon={FaShoppingBag} size={18} />
            Pedidos
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink to="/admin/settings">
            <IconRenderer icon={FaCog} size={18} />
            Configurações
          </StyledNavLink>
        </MenuItem>
      </Menu>
      
      {user && (
        <UserInfo>
          <UserName>{user.name}</UserName>
          <UserRole>{user.role === 'admin' ? 'Administrador' : 'Gerente'}</UserRole>
        </UserInfo>
      )}
      
      <LogoutButton onClick={logout}>
        <IconRenderer icon={FaSignOutAlt} size={18} />
        Sair
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar; 
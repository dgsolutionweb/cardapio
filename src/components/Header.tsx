import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const HeaderContainer = styled.header`
  background-color: #f8e8e8;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #d23669;
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
  
  &:hover {
    color: #d23669;
  }
`;

const CartIcon = styled.div`
  position: relative;
  cursor: pointer;
  
  svg {
    font-size: 1.4rem;
    color: #333;
  }
`;

const CartCounter = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #d23669;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  
  return (
    <HeaderContainer>
      <Logo>
        <Link to="/">DG Cardápios</Link>
      </Logo>
      
      <Nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/menu">Cardápio</NavLink>
        <NavLink to="/cart">
          <CartIcon>
            {FaShoppingCart({ size: 20 })}
            {getTotalItems() > 0 && <CartCounter>{getTotalItems()}</CartCounter>}
          </CartIcon>
        </NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 
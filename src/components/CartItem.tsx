import React from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItemContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 5px;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const ItemPrice = styled.p`
  margin: 0;
  font-weight: bold;
  color: #d23669;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const QuantityText = styled.span`
  margin: 0 0.5rem;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #c0392b;
  }
`;

const ItemTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const TotalText = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrementQuantity = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleDecrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };
  
  const handleRemoveItem = () => {
    removeFromCart(item.product.id);
  };
  
  const totalPrice = item.product.price * item.quantity;
  
  return (
    <CartItemContainer>
      <ItemImage>
        <img src={item.product.image} alt={item.product.name} />
      </ItemImage>
      
      <ItemDetails>
        <ItemName>{item.product.name}</ItemName>
        <ItemPrice>R$ {item.product.price.toFixed(2)}</ItemPrice>
        
        <ItemActions>
          <QuantityControl>
            <QuantityButton onClick={handleDecrementQuantity}>
              {FaMinus({ size: 12 })}
            </QuantityButton>
            <QuantityText>{item.quantity}</QuantityText>
            <QuantityButton onClick={handleIncrementQuantity}>
              {FaPlus({ size: 12 })}
            </QuantityButton>
          </QuantityControl>
          
          <RemoveButton onClick={handleRemoveItem}>
            {FaTrash({ size: 14 })}
          </RemoveButton>
        </ItemActions>
      </ItemDetails>
      
      <ItemTotal>
        <TotalText>R$ {totalPrice.toFixed(2)}</TotalText>
      </ItemTotal>
    </CartItemContainer>
  );
};

export default CartItemComponent; 
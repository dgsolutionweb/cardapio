import React from 'react';
import styled from 'styled-components';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const ProductPrice = styled.p`
  margin: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #d23669;
`;

const ProductDescription = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #d23669;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #b92d5b;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <Card>
      <ProductImage>
        <img src={product.image} alt={product.name} />
      </ProductImage>
      
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
        <ProductDescription>{product.description}</ProductDescription>
        
        <AddToCartButton onClick={handleAddToCart}>
          {FaShoppingCart({ size: 16 })}
          Adicionar ao Carrinho
        </AddToCartButton>
      </ProductInfo>
    </Card>
  );
};

export default ProductCard; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const MenuContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #d23669;
    margin: 0.5rem auto;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin: 2rem 0;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  margin: 2rem 0;
  font-size: 1.2rem;
  color: #d23669;
`;

const MenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        
        const data = await response.json();
        setProducts(data.filter((product: Product) => product.active));
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <MenuContainer>
      <PageTitle>Nosso Cardápio</PageTitle>
      
      {loading && <LoadingMessage>Carregando produtos...</LoadingMessage>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && !error && (
        <ProductGrid>
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>Nenhum produto disponível no momento.</p>
          )}
        </ProductGrid>
      )}
    </MenuContainer>
  );
};

export default MenuPage; 
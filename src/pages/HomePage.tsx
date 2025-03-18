import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, StoreSettings } from '../types';
import SettingService from '../services/settingService';
import { FaClock, FaTruck, FaMoneyBill, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const HomeContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
              url('https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  color: #d23669;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
  max-width: 700px;
`;

const ShopButton = styled(Link)`
  background-color: #d23669;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #b92d5b;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
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
  margin-top: 2rem;
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

const Footer = styled.footer`
  background-color: #f8f8f8;
  padding: 2rem;
  margin-top: 3rem;
  border-radius: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const FooterTitle = styled.h3`
  font-size: 1.4rem;
  color: #d23669;
  margin-bottom: 1.5rem;
  text-align: center;
  
  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background-color: #d23669;
    margin: 0.5rem auto;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const InfoIcon = styled.div`
  color: #d23669;
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
`;

const InfoTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const DeliveryBanner = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DeliveryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #666;
  
  svg {
    color: #d23669;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #eee;
  margin: 2rem 0;
`;

const Copyright = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  margin-top: 2rem;
`;

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar produtos
        const productsResponse = await fetch('http://localhost:3001/api/products');
        
        if (!productsResponse.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        
        const productsData = await productsResponse.json();
        // Filtrar produtos ativos e pegar os 3 primeiros
        const activeProducts = productsData.filter((product: Product) => product.active);
        setFeaturedProducts(activeProducts.slice(0, 3));
        
        // Buscar configurações da loja
        const storeSettings = await SettingService.getAllSettings();
        setSettings(storeSettings);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>{settings?.store_name || 'Sweet Cakes'}</HeroTitle>
        <HeroSubtitle>
          {settings?.store_description || 
            'Deliciosos bolos artesanais para todos os momentos especiais. Saboreie nossas criações feitas com ingredientes frescos e muito amor.'}
        </HeroSubtitle>
        <ShopButton to="/menu">Ver Cardápio</ShopButton>
      </Hero>
      
      <MainContent>
        <SectionTitle>Destaques</SectionTitle>
        
        {loading && <LoadingMessage>Carregando produtos...</LoadingMessage>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {!loading && !error && (
          <ProductGrid>
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <LoadingMessage>Nenhum produto em destaque no momento.</LoadingMessage>
            )}
          </ProductGrid>
        )}
      </MainContent>
      
      <Footer>
        <FooterTitle>Informações da Loja</FooterTitle>
        <InfoGrid>
          <InfoCard>
            <InfoIcon>
              {FaMapMarkerAlt({ size: 24 })}
            </InfoIcon>
            <InfoTitle>Endereço</InfoTitle>
            <InfoText>{settings?.store_address || 'Endereço não configurado'}</InfoText>
          </InfoCard>
          
          <InfoCard>
            <InfoIcon>
              {FaPhone({ size: 24 })}
            </InfoIcon>
            <InfoTitle>Contato</InfoTitle>
            <InfoText>{settings?.store_phone || 'Telefone não configurado'}</InfoText>
            <InfoText>{settings?.store_email || 'Email não configurado'}</InfoText>
          </InfoCard>
        </InfoGrid>
        
        <DeliveryBanner>
          <DeliveryItem>
            {FaTruck({ size: 18 })}
            <span>Taxa de entrega: R$ {settings?.delivery_fee?.toFixed(2) || '0.00'}</span>
          </DeliveryItem>
          <DeliveryItem>
            {FaMoneyBill({ size: 18 })}
            <span>Pedido mínimo: R$ {settings?.min_order_value?.toFixed(2) || '0.00'}</span>
          </DeliveryItem>
          <DeliveryItem>
            {FaClock({ size: 18 })}
            <span>Tempo de entrega: {settings?.delivery_time || '30-45 min'}</span>
          </DeliveryItem>
        </DeliveryBanner>
        
        <Divider />
        
        <Copyright>© {new Date().getFullYear()} {settings?.store_name || 'Sweet Cakes'} - Todos os direitos reservados</Copyright>
      </Footer>
    </HomeContainer>
  );
};

export default HomePage; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdminData } from '../../context/admin/AdminDataContext';
import { Order, Product } from '../../types';
import { FaShoppingCart, FaClock, FaMoneyBill, FaBox, FaTags, FaChartLine, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const FilterSection = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#d23669' : '#ddd'};
  border-radius: 20px;
  background-color: ${props => props.active ? '#d23669' : '#fff'};
  color: ${props => props.active ? '#fff' : '#666'};
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.active ? '#b92d5b' : '#f5f5f5'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d23669;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.positive ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 4px;
  color: #666;
`;

const RecentOrders = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f8f8;
  color: #666;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'confirmed': return '#cce5ff';
      case 'delivered': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'confirmed': return '#004085';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const TopProducts = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 500;
  color: #333;
`;

const ProductSales = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const DashboardPage: React.FC = () => {
  const { orders, products } = useAdminData();
  const [timeFilter, setTimeFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Calcular estatísticas
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeProducts = products.filter(product => product.active).length;
  const totalCategories = new Set(products.map(product => product.categoryName)).size;
  
  // Calcular mudanças percentuais (exemplo)
  const revenueChange = 12.5; // Exemplo de aumento de 12.5%
  const ordersChange = -5.2; // Exemplo de diminuição de 5.2%
  
  // Filtrar pedidos recentes
  const recentOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Calcular produtos mais vendidos
  const topProducts = products
    .map(product => ({
      ...product,
      totalSales: orders.reduce((sum, order) => {
        const orderItem = order.items.find(item => item.product.id === product.id);
        return sum + (orderItem ? orderItem.quantity : 0);
      }, 0)
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);
  
  return (
    <DashboardContainer>
      <PageTitle>Dashboard</PageTitle>
      
      <FilterSection>
        <FilterTitle>
          {FaFilter({ size: 16 })}
          Filtros
        </FilterTitle>
        <FilterOptions>
          <FilterButton 
            active={timeFilter === 'today'}
            onClick={() => setTimeFilter('today')}
          >
            {FaCalendarAlt({ size: 14 })}
            Hoje
          </FilterButton>
          <FilterButton 
            active={timeFilter === 'week'}
            onClick={() => setTimeFilter('week')}
          >
            {FaCalendarAlt({ size: 14 })}
            Esta Semana
          </FilterButton>
          <FilterButton 
            active={timeFilter === 'month'}
            onClick={() => setTimeFilter('month')}
          >
            {FaCalendarAlt({ size: 14 })}
            Este Mês
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            Todos os Status
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
          >
            Pendentes
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'confirmed'}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmados
          </FilterButton>
        </FilterOptions>
      </FilterSection>
      
      <StatsGrid>
        <StatCard>
          <StatIcon>
            {FaShoppingCart({ size: 24 })}
          </StatIcon>
          <StatInfo>
            <StatTitle>Total de Pedidos</StatTitle>
            <StatValue>{totalOrders}</StatValue>
            <StatChange positive={ordersChange > 0}>
              {ordersChange > 0 ? '↑' : '↓'} {Math.abs(ordersChange)}%
            </StatChange>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            {FaClock({ size: 24 })}
          </StatIcon>
          <StatInfo>
            <StatTitle>Pedidos Pendentes</StatTitle>
            <StatValue>{pendingOrders}</StatValue>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            {FaMoneyBill({ size: 24 })}
          </StatIcon>
          <StatInfo>
            <StatTitle>Receita Total</StatTitle>
            <StatValue>R$ {totalRevenue.toFixed(2)}</StatValue>
            <StatChange positive={revenueChange > 0}>
              {revenueChange > 0 ? '↑' : '↓'} {Math.abs(revenueChange)}%
            </StatChange>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            {FaBox({ size: 24 })}
          </StatIcon>
          <StatInfo>
            <StatTitle>Produtos Ativos</StatTitle>
            <StatValue>{activeProducts}</StatValue>
          </StatInfo>
        </StatCard>
      </StatsGrid>
      
      <ChartsSection>
        <ChartCard>
          <ChartTitle>
            {FaChartLine({ size: 16 })}
            Vendas por Período
          </ChartTitle>
          <ChartPlaceholder>
            Gráfico de vendas será implementado aqui
          </ChartPlaceholder>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            {FaTags({ size: 16 })}
            Produtos Mais Vendidos
          </ChartTitle>
          <ChartPlaceholder>
            Gráfico de produtos mais vendidos será implementado aqui
          </ChartPlaceholder>
        </ChartCard>
      </ChartsSection>
      
      <RecentOrders>
        <ChartTitle>Pedidos Recentes</ChartTitle>
        <OrdersTable>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Data</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status}>
                    {order.status === 'pending' && 'Pendente'}
                    {order.status === 'confirmed' && 'Confirmado'}
                    {order.status === 'delivered' && 'Entregue'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </StatusBadge>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
      </RecentOrders>
      
      <TopProducts>
        <ChartTitle>Produtos Mais Vendidos</ChartTitle>
        <ProductList>
          {topProducts.map(product => (
            <ProductCard key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductSales>{product.totalSales} vendas</ProductSales>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductList>
      </TopProducts>
    </DashboardContainer>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaWhatsapp } from 'react-icons/fa';
import { useAdminData } from '../../context/admin/AdminDataContext';
import { Order, CartItem } from '../../types';
import { IconRenderer } from '../../utils/IconRenderer';

const PageContainer = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid #f1f1f1;
  color: #7f8c8d;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #f1f1f1;
  color: #34495e;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $color: string }>`
  background-color: ${(props) => props.$color};
  color: white;
  border: none;
  border-radius: 5px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'pending': return '#F9E4B7';
      case 'confirmed': return '#AEDCF0';
      case 'delivered': return '#B7F9C9';
      case 'cancelled': return '#F9B7B7';
      default: return '#f1f1f1';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'pending': return '#8B6914';
      case 'confirmed': return '#0D507A';
      case 'delivered': return '#0A7A27';
      case 'cancelled': return '#7A0D0D';
      default: return '#333';
    }
  }};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  
  &:hover {
    color: #34495e;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #34495e;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f1f1;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #25D366;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #128C7E;
  }
`;

const StatusSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`;

const StatusButton = styled.button<{ $status: string; $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: 2px solid transparent;
  background-color: ${(props) => {
    if (props.$active) {
      switch (props.$status) {
        case 'pending': return '#F9E4B7';
        case 'confirmed': return '#AEDCF0';
        case 'delivered': return '#B7F9C9';
        case 'cancelled': return '#F9B7B7';
        default: return '#f1f1f1';
      }
    }
    return 'transparent';
  }};
  color: ${(props) => {
    if (props.$active) {
      switch (props.$status) {
        case 'pending': return '#8B6914';
        case 'confirmed': return '#0D507A';
        case 'delivered': return '#0A7A27';
        case 'cancelled': return '#7A0D0D';
        default: return '#333';
      }
    }
    return '#7f8c8d';
  }};
  border-color: ${(props) => {
    switch (props.$status) {
      case 'pending': return '#F9E4B7';
      case 'confirmed': return '#AEDCF0';
      case 'delivered': return '#B7F9C9';
      case 'cancelled': return '#F9B7B7';
      default: return '#f1f1f1';
    }
  }};
  
  &:hover {
    opacity: 0.8;
  }
`;

const OrderItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const OrderItemTh = styled.th`
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid #f1f1f1;
  color: #7f8c8d;
  font-weight: 600;
  font-size: 0.9rem;
`;

const OrderItemTd = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #f1f1f1;
  color: #34495e;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
`;

const TotalRow = styled.tr`
  font-weight: bold;
  
  td {
    padding-top: 1rem;
    color: #e74c3c;
  }
`;

const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useAdminData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  const openOrderDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
  };
  
  const handleUpdateStatus = (orderId: number, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    
    // Atualizar o pedido atual também se o modal estiver aberto
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status,
        updatedAt: new Date()
      });
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getItemsCount = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const getWhatsAppLink = (phone: string): string => {
    // Remover caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };
  
  // Ordenando pedidos por data (mais recentes primeiro)
  const sortedOrders = [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gerenciar Pedidos</PageTitle>
      </PageHeader>
      
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Cliente</Th>
              <Th>Data</Th>
              <Th>Itens</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map(order => (
              <tr key={order.id}>
                <Td>#{order.id}</Td>
                <Td>{order.customerName}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td>{getItemsCount(order.items)}</Td>
                <Td>{formatCurrency(order.total)}</Td>
                <Td>
                  <StatusBadge $status={order.status}>
                    {getStatusLabel(order.status)}
                  </StatusBadge>
                </Td>
                <Td>
                  <ButtonGroup>
                    <IconButton 
                      $color="#3498db" 
                      onClick={() => openOrderDetails(order)}
                      title="Ver detalhes"
                    >
                      <IconRenderer icon={FaEye} size={14} />
                    </IconButton>
                    
                    <IconButton 
                      $color="#25D366" 
                      onClick={() => window.open(getWhatsAppLink(order.customerPhone), '_blank')}
                      title="Contatar cliente"
                    >
                      <IconRenderer icon={FaWhatsapp} size={14} />
                    </IconButton>
                  </ButtonGroup>
                </Td>
              </tr>
            ))}
            
            {orders.length === 0 && (
              <tr>
                <Td colSpan={7} style={{ textAlign: 'center' }}>
                  Nenhum pedido encontrado
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
      
      {isModalOpen && currentOrder && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                Pedido #{currentOrder.id}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <Section>
              <SectionTitle>Informações do Cliente</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Nome</InfoLabel>
                  <InfoValue>{currentOrder.customerName}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue>{currentOrder.customerPhone}</InfoValue>
                  <ContactButton 
                    href={getWhatsAppLink(currentOrder.customerPhone)} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconRenderer icon={FaWhatsapp} size={14} />
                    WhatsApp
                  </ContactButton>
                </InfoItem>
              </InfoGrid>
              
              <InfoItem>
                <InfoLabel>Endereço</InfoLabel>
                <InfoValue>{currentOrder.customerAddress}</InfoValue>
              </InfoItem>
            </Section>
            
            <Section>
              <SectionTitle>Informações do Pedido</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Data do Pedido</InfoLabel>
                  <InfoValue>{formatDate(currentOrder.createdAt)}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Última Atualização</InfoLabel>
                  <InfoValue>{formatDate(currentOrder.updatedAt)}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Status</InfoLabel>
                  <InfoValue>
                    <StatusBadge $status={currentOrder.status}>
                      {getStatusLabel(currentOrder.status)}
                    </StatusBadge>
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
              
              <StatusSelector>
                <StatusButton 
                  $status="pending" 
                  $active={currentOrder.status === 'pending'}
                  onClick={() => handleUpdateStatus(currentOrder.id, 'pending')}
                  disabled={currentOrder.status === 'pending'}
                >
                  Pendente
                </StatusButton>
                
                <StatusButton 
                  $status="confirmed" 
                  $active={currentOrder.status === 'confirmed'}
                  onClick={() => handleUpdateStatus(currentOrder.id, 'confirmed')}
                  disabled={currentOrder.status === 'confirmed'}
                >
                  Confirmado
                </StatusButton>
                
                <StatusButton 
                  $status="delivered" 
                  $active={currentOrder.status === 'delivered'}
                  onClick={() => handleUpdateStatus(currentOrder.id, 'delivered')}
                  disabled={currentOrder.status === 'delivered'}
                >
                  Entregue
                </StatusButton>
                
                <StatusButton 
                  $status="cancelled" 
                  $active={currentOrder.status === 'cancelled'}
                  onClick={() => handleUpdateStatus(currentOrder.id, 'cancelled')}
                  disabled={currentOrder.status === 'cancelled'}
                >
                  Cancelado
                </StatusButton>
              </StatusSelector>
            </Section>
            
            <Section>
              <SectionTitle>Itens do Pedido</SectionTitle>
              <OrderItemsTable>
                <thead>
                  <tr>
                    <OrderItemTh>Produto</OrderItemTh>
                    <OrderItemTh>Quantidade</OrderItemTh>
                    <OrderItemTh>Preço Unit.</OrderItemTh>
                    <OrderItemTh>Subtotal</OrderItemTh>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items.map((item, index) => (
                    <tr key={index}>
                      <OrderItemTd>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ItemImage src={item.product.image} alt={item.product.name} />
                          <span>{item.product.name}</span>
                        </div>
                      </OrderItemTd>
                      <OrderItemTd>{item.quantity}</OrderItemTd>
                      <OrderItemTd>{formatCurrency(item.product.price)}</OrderItemTd>
                      <OrderItemTd>{formatCurrency(item.product.price * item.quantity)}</OrderItemTd>
                    </tr>
                  ))}
                  
                  <TotalRow>
                    <OrderItemTd colSpan={3} style={{ textAlign: 'right' }}>Total:</OrderItemTd>
                    <OrderItemTd>{formatCurrency(currentOrder.total)}</OrderItemTd>
                  </TotalRow>
                </tbody>
              </OrderItemsTable>
            </Section>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default OrdersPage; 
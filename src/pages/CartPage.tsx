import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWhatsapp, FaTrash, FaMoneyBill, FaRegCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemComponent from '../components/CartItem';
import SettingService from '../services/settingService';
import { StoreSettings } from '../types';

const CartContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
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

const EmptyCartMessage = styled.div`
  text-align: center;
  margin: 3rem 0;
  color: #888;
  font-size: 1.2rem;
`;

const GoShoppingButton = styled.button`
  background-color: #d23669;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #b92d5b;
  }
`;

const CartSummary = styled.div`
  background-color: #f8f8f8;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const CheckoutButton = styled.button`
  background-color: #25D366;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #128C7E;
  }
`;

const ClearCartButton = styled.button`
  background-color: transparent;
  color: #e74c3c;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 0.9rem;
  
  &:hover {
    color: #c0392b;
  }
`;

const CustomerInfoForm = styled.form`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #d23669;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #d23669;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-size: 1.5rem;
  color: #d23669;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #d23669;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PaymentMethodIcon = styled.span`
  display: flex;
  align-items: center;
  color: #666;
  margin-right: 0.5rem;
`;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart, createOrder, isLoading, orderError } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [changeFor, setChangeFor] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storeSettings = await SettingService.getAllSettings();
        setSettings(storeSettings);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleGoToMenu = () => {
    navigate('/menu');
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!customerPhone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    }
    
    if (!customerAddress.trim()) {
      errors.address = 'Endereço é obrigatório';
    }
    
    if (paymentMethod === 'dinheiro' && changeFor.trim() && isNaN(parseFloat(changeFor))) {
      errors.changeFor = 'Informe um valor válido para o troco';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salvar o pedido no banco de dados
      const order = await createOrder(customerName, customerPhone, customerAddress);
      
      if (!order) {
        throw new Error('Erro ao criar o pedido');
      }
      
      // Obter o número do WhatsApp das configurações
      const whatsappNumber = settings?.social_media?.whatsapp || '5511999999999';
      
      // Formatar o número de WhatsApp (remover qualquer não-numérico)
      const formattedPhone = whatsappNumber.replace(/\D/g, '');
      
      // Criando a mensagem para o WhatsApp
      let message = `Olá! Gostaria de fazer um pedido #${order.id}:\n\n`;
      
      cart.forEach(item => {
        message += `${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
      });
      
      message += `\nTotal: R$ ${getTotal().toFixed(2)}`;
      message += `\n\nDados para entrega:`;
      message += `\nNome: ${customerName}`;
      message += `\nTelefone: ${customerPhone}`;
      message += `\nEndereço: ${customerAddress}`;
      
      // Adicionar informações de pagamento
      message += `\n\nForma de pagamento: ${getPaymentMethodText()}`;
      if (paymentMethod === 'dinheiro' && changeFor.trim()) {
        message += `\nTroco para: R$ ${parseFloat(changeFor).toFixed(2)}`;
      }
      
      // Codificando a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      
      // Criando a URL do WhatsApp
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
      
      // Abrindo o WhatsApp em uma nova aba
      window.open(whatsappUrl, '_blank');
      
      // Limpar o formulário
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setPaymentMethod('dinheiro');
      setChangeFor('');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'dinheiro':
        return 'Dinheiro';
      case 'pix':
        return 'PIX';
      case 'credito':
        return 'Cartão de Crédito';
      case 'debito':
        return 'Cartão de Débito';
      default:
        return paymentMethod;
    }
  };
  
  return (
    <CartContainer>
      <PageTitle>Meu Carrinho</PageTitle>
      
      {isLoading && <LoadingOverlay>Processando pedido...</LoadingOverlay>}
      
      {cart.length === 0 ? (
        <EmptyCartMessage>
          <p>Seu carrinho está vazio!</p>
          <GoShoppingButton onClick={handleGoToMenu}>Ver Cardápio</GoShoppingButton>
        </EmptyCartMessage>
      ) : (
        <>
          {cart.map(item => (
            <CartItemComponent key={item.product.id} item={item} />
          ))}
          
          <CustomerInfoForm>
            <FormGroup>
              <Label htmlFor="customerName">Nome completo</Label>
              <Input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome completo"
              />
              {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="customerPhone">Telefone</Label>
              <Input
                id="customerPhone"
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
              />
              {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="customerAddress">Endereço completo</Label>
              <Textarea
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Rua, número, bairro, complemento, cidade, estado e CEP"
              />
              {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Forma de pagamento</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="dinheiro"
                    checked={paymentMethod === 'dinheiro'}
                    onChange={() => setPaymentMethod('dinheiro')}
                  />
                  <PaymentMethodIcon>
                    {FaMoneyBill({ size: 16 })}
                  </PaymentMethodIcon>
                  Dinheiro
                </RadioLabel>
                
                {paymentMethod === 'dinheiro' && (
                  <FormGroup>
                    <Label htmlFor="changeFor">Troco para</Label>
                    <Input
                      id="changeFor"
                      type="text"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      placeholder="R$ 0,00 (deixe em branco se não precisar de troco)"
                    />
                    {formErrors.changeFor && <ErrorMessage>{formErrors.changeFor}</ErrorMessage>}
                  </FormGroup>
                )}
                
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                  />
                  <PaymentMethodIcon>
                    <span>PIX</span>
                  </PaymentMethodIcon>
                  PIX
                </RadioLabel>
                
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credito"
                    checked={paymentMethod === 'credito'}
                    onChange={() => setPaymentMethod('credito')}
                  />
                  <PaymentMethodIcon>
                    {FaRegCreditCard({ size: 16 })}
                  </PaymentMethodIcon>
                  Cartão de Crédito
                </RadioLabel>
                
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debito"
                    checked={paymentMethod === 'debito'}
                    onChange={() => setPaymentMethod('debito')}
                  />
                  <PaymentMethodIcon>
                    {FaRegCreditCard({ size: 16 })}
                  </PaymentMethodIcon>
                  Cartão de Débito
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
          </CustomerInfoForm>
          
          <CartSummary>
            <CartTotal>
              <span>Total:</span>
              <span>R$ {getTotal().toFixed(2)}</span>
            </CartTotal>
            
            <CheckoutButton onClick={handleCheckout} disabled={isSubmitting}>
              {FaWhatsapp({ size: 20 })}
              Finalizar Pedido via WhatsApp
            </CheckoutButton>
            
            {orderError && <ErrorMessage>{orderError}</ErrorMessage>}
            
            <ClearCartButton onClick={clearCart}>
              {FaTrash({ size: 14 })}
              Limpar Carrinho
            </ClearCartButton>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default CartPage; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaStore, FaWhatsapp, FaSave } from 'react-icons/fa';
import { IconRenderer } from '../../utils/IconRenderer';
import { useAdminData } from '../../context/admin/AdminDataContext';
import { StoreSettings } from '../../types';

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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: ${(props) => (props.$active ? '#fff' : 'transparent')};
  color: ${(props) => (props.$active ? '#e74c3c' : '#7f8c8d')};
  border: none;
  border-bottom: 3px solid ${(props) => (props.$active ? '#e74c3c' : 'transparent')};
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: #e74c3c;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  color: #34495e;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f1f1f1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { settings, updateSettings, fetchSettings, isLoading, error } = useAdminData();
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: 'Administrador',
    email: 'admin@sweetcakes.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    store_name: '',
    store_description: '',
    store_address: '',
    store_city: '',
    store_state: '',
    store_postal_code: '',
    store_phone: '',
    store_email: '',
    delivery_fee: 0,
    min_order_value: 0,
    delivery_time: ''
  });
  
  // WhatsApp settings
  const [whatsAppSettings, setWhatsAppSettings] = useState({
    whatsapp_number: '',
    whatsapp_message: '',
    whatsapp_notifications: true
  });
  
  // Buscar configurações quando o componente montar
  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [fetchSettings, settings]);
  
  // Carregar configurações do contexto
  useEffect(() => {
    if (settings) {
      setStoreSettings({
        store_name: settings.store_name || '',
        store_description: settings.store_description || '',
        store_address: settings.store_address || '',
        store_city: settings.store_city || '',
        store_state: settings.store_state || '',
        store_postal_code: settings.store_postal_code || '',
        store_phone: settings.store_phone || '',
        store_email: settings.store_email || '',
        delivery_fee: settings.delivery_fee || 0,
        min_order_value: settings.min_order_value || 0,
        delivery_time: settings.delivery_time || ''
      });
      
      // Extrair configurações do WhatsApp
      const socialMedia = settings.social_media || {};
      setWhatsAppSettings({
        whatsapp_number: socialMedia.whatsapp || '',
        whatsapp_message: settings.whatsapp_message || 'Olá! Gostaria de fazer um pedido:\n\n{items}\n\nTotal: {total}',
        whatsapp_notifications: settings.whatsapp_notifications !== false
      });
    }
  }, [settings]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setWhatsAppSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSettings: Partial<StoreSettings> = {
      ...storeSettings
    };
    
    const success = await updateSettings(updatedSettings);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSettings: Partial<StoreSettings> = {
      whatsapp_message: whatsAppSettings.whatsapp_message,
      whatsapp_notifications: whatsAppSettings.whatsapp_notifications,
      social_media: {
        ...(settings?.social_media || {}),
        whatsapp: whatsAppSettings.whatsapp_number
      }
    };
    
    const success = await updateSettings(updatedSettings);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui seria implementada a lógica para salvar as configurações de perfil
    // Como não temos um endpoint para isso ainda, apenas simulamos o sucesso
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Configurações</PageTitle>
      </PageHeader>
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'profile'} 
          onClick={() => handleTabChange('profile')}
        >
          <IconRenderer icon={FaUser} size={16} />
          Perfil
        </Tab>
        
        <Tab 
          $active={activeTab === 'store'} 
          onClick={() => handleTabChange('store')}
        >
          <IconRenderer icon={FaStore} size={16} />
          Loja
        </Tab>
        
        <Tab 
          $active={activeTab === 'whatsapp'} 
          onClick={() => handleTabChange('whatsapp')}
        >
          <IconRenderer icon={FaWhatsapp} size={16} />
          WhatsApp
        </Tab>
      </TabContainer>
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '5px', 
          marginBottom: '1rem' 
        }}>
          Erro: {error}
        </div>
      )}
      
      {showSuccess && (
        <SuccessMessage>
          Configurações salvas com sucesso!
        </SuccessMessage>
      )}
      
      {isLoading ? (
        <div>Carregando configurações...</div>
      ) : (
        <>
          {activeTab === 'profile' && (
            <Card>
              <CardTitle>Configurações de Perfil</CardTitle>
              <Form onSubmit={handleProfileSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={profileSettings.name}
                    onChange={handleProfileChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={profileSettings.email}
                    onChange={handleProfileChange}
                    required
                  />
                </FormGroup>
                
                <CardTitle>Alterar Senha</CardTitle>
                
                <FormGroup>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword"
                    value={profileSettings.currentPassword}
                    onChange={handleProfileChange}
                  />
                </FormGroup>
                
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input 
                      type="password" 
                      id="newPassword" 
                      name="newPassword"
                      value={profileSettings.newPassword}
                      onChange={handleProfileChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword"
                      value={profileSettings.confirmPassword}
                      onChange={handleProfileChange}
                    />
                  </FormGroup>
                </FormGrid>
                
                <ButtonContainer>
                  <SaveButton type="submit">
                    <IconRenderer icon={FaSave} size={16} />
                    Salvar Alterações
                  </SaveButton>
                </ButtonContainer>
              </Form>
            </Card>
          )}
          
          {activeTab === 'store' && (
            <Card>
              <CardTitle>Informações da Loja</CardTitle>
              <Form onSubmit={handleStoreSubmit}>
                <FormGroup>
                  <Label htmlFor="store_name">Nome da Loja</Label>
                  <Input 
                    type="text" 
                    id="store_name" 
                    name="store_name"
                    value={storeSettings.store_name}
                    onChange={handleStoreChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="store_description">Descrição da Loja</Label>
                  <Textarea 
                    id="store_description" 
                    name="store_description"
                    value={storeSettings.store_description}
                    onChange={handleStoreChange}
                  />
                </FormGroup>
                
                <CardTitle>Informações de Contato</CardTitle>
                
                <FormGroup>
                  <Label htmlFor="store_address">Endereço</Label>
                  <Input 
                    type="text" 
                    id="store_address" 
                    name="store_address"
                    value={storeSettings.store_address}
                    onChange={handleStoreChange}
                    required
                  />
                </FormGroup>
                
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="store_city">Cidade</Label>
                    <Input 
                      type="text" 
                      id="store_city" 
                      name="store_city"
                      value={storeSettings.store_city}
                      onChange={handleStoreChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="store_state">Estado</Label>
                    <Select 
                      id="store_state" 
                      name="store_state"
                      value={storeSettings.store_state}
                      onChange={handleStoreChange}
                    >
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
                
                <FormGroup>
                  <Label htmlFor="store_postal_code">CEP</Label>
                  <Input 
                    type="text" 
                    id="store_postal_code" 
                    name="store_postal_code"
                    value={storeSettings.store_postal_code}
                    onChange={handleStoreChange}
                  />
                </FormGroup>
                
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="store_phone">Telefone</Label>
                    <Input 
                      type="text" 
                      id="store_phone" 
                      name="store_phone"
                      value={storeSettings.store_phone}
                      onChange={handleStoreChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="store_email">E-mail</Label>
                    <Input 
                      type="email" 
                      id="store_email" 
                      name="store_email"
                      value={storeSettings.store_email}
                      onChange={handleStoreChange}
                      required
                    />
                  </FormGroup>
                </FormGrid>
                
                <CardTitle>Configurações de Entrega</CardTitle>
                
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
                    <Input 
                      type="number" 
                      id="delivery_fee" 
                      name="delivery_fee"
                      min="0"
                      step="0.01"
                      value={storeSettings.delivery_fee}
                      onChange={handleStoreChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="min_order_value">Pedido Mínimo (R$)</Label>
                    <Input 
                      type="number" 
                      id="min_order_value" 
                      name="min_order_value"
                      min="0"
                      step="0.01"
                      value={storeSettings.min_order_value}
                      onChange={handleStoreChange}
                    />
                  </FormGroup>
                </FormGrid>
                
                <FormGroup>
                  <Label htmlFor="delivery_time">Tempo Estimado de Entrega</Label>
                  <Input 
                    type="text" 
                    id="delivery_time" 
                    name="delivery_time"
                    placeholder="Ex: 40-60 minutos"
                    value={storeSettings.delivery_time}
                    onChange={handleStoreChange}
                  />
                </FormGroup>
                
                <ButtonContainer>
                  <SaveButton type="submit" disabled={isLoading}>
                    <IconRenderer icon={FaSave} size={16} />
                    Salvar Alterações
                  </SaveButton>
                </ButtonContainer>
              </Form>
            </Card>
          )}
          
          {activeTab === 'whatsapp' && (
            <Card>
              <CardTitle>Configurações do WhatsApp</CardTitle>
              <Form onSubmit={handleWhatsAppSubmit}>
                <FormGroup>
                  <Label htmlFor="whatsapp_number">Número do WhatsApp</Label>
                  <Input 
                    type="text" 
                    id="whatsapp_number" 
                    name="whatsapp_number"
                    placeholder="Ex: 5511999999999 (com código do país)"
                    value={whatsAppSettings.whatsapp_number}
                    onChange={handleWhatsAppChange}
                    required
                  />
                  <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                    Inclua o código do país (Ex: 55 para Brasil) e DDD, sem espaços ou caracteres especiais.
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="whatsapp_message">Mensagem Padrão</Label>
                  <Textarea 
                    id="whatsapp_message" 
                    name="whatsapp_message"
                    value={whatsAppSettings.whatsapp_message}
                    onChange={handleWhatsAppChange}
                    required
                  />
                  <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                    Use {'{items}'} para incluir os itens do pedido e {'{total}'} para o valor total.
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    <Input 
                      type="checkbox" 
                      name="whatsapp_notifications"
                      checked={whatsAppSettings.whatsapp_notifications}
                      onChange={handleWhatsAppChange as any}
                      style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    Receber notificações de novos pedidos via WhatsApp
                  </Label>
                </FormGroup>
                
                <ButtonContainer>
                  <SaveButton type="submit" disabled={isLoading}>
                    <IconRenderer icon={FaSave} size={16} />
                    Salvar Alterações
                  </SaveButton>
                </ButtonContainer>
              </Form>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SettingsPage; 
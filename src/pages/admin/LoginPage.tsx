import React, { useState } from 'react';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { IconRenderer } from '../../utils/IconRenderer';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.h1`
  color: #e74c3c;
  font-size: 2rem;
  margin: 0;
`;

const LogoSubtitle = styled.p`
  color: #7f8c8d;
  margin: 0.5rem 0 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SubmitButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
`;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, login } = useAdminAuth();
  
  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }
    
    try {
      await login(username, password);
      // Se chegou aqui, o login foi bem-sucedido porque login lança erro em caso de falha
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError((err as Error).message || 'Usuário ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LogoContainer>
          <Logo>Sweet Admin</Logo>
          <LogoSubtitle>Painel de Administração</LogoSubtitle>
        </LogoContainer>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input 
              type="text" 
              placeholder="Nome de usuário" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            <IconWrapper>
              <IconRenderer icon={FaUser} size={16} />
            </IconWrapper>
          </FormGroup>
          
          <FormGroup>
            <Input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <IconWrapper>
              <IconRenderer icon={FaLock} size={16} />
            </IconWrapper>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage; 
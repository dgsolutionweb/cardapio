import { AdminUser } from '../types';

// Em uma aplicação real, essas senhas seriam hash criptografadas
export const users: (AdminUser & { password: string })[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Administrador',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 2,
    username: 'gerente',
    name: 'Gerente de Vendas',
    role: 'manager',
    password: 'gerente123'
  }
]; 
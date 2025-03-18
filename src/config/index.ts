import dotenv from 'dotenv';

// Carregando as variáveis de ambiente
dotenv.config();

// Configurações do banco de dados
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cake_shop',
};

// Outras configurações globais da aplicação
export const appConfig = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development',
}; 
-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS cake_shop;

USE cake_shop;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager') NOT NULL DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    categoryId INT,
    stock INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(100) NOT NULL,
    customerPhone VARCHAR(20) NOT NULL,
    customerAddress TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de itens de pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (username, password, name, role) 
VALUES ('admin', 'admin123', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE username = 'admin';

-- Inserir algumas categorias
INSERT INTO categories (name, description, active) VALUES 
('Bolos', 'Bolos tradicionais e especiais', TRUE),
('Cupcakes', 'Cupcakes de diversos sabores', TRUE),
('Tortas', 'Tortas doces e salgadas', TRUE),
('Doces', 'Doces variados para festas', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Inserir alguns produtos
INSERT INTO products (name, price, description, image, categoryId, stock, active) VALUES 
('Bolo de Chocolate', 45.00, 'Delicioso bolo de chocolate com cobertura de brigadeiro', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', 1, 10, TRUE),
('Bolo de Morango', 50.00, 'Bolo recheado com morangos frescos e creme', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b', 1, 8, TRUE),
('Cupcake de Baunilha', 6.50, 'Cupcake de baunilha com cobertura de buttercream', 'https://images.unsplash.com/photo-1587668178277-295251f900ce', 2, 20, TRUE),
('Torta de Limão', 40.00, 'Torta de limão com merengue', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13', 3, 5, TRUE),
('Brigadeiro Gourmet', 3.50, 'Brigadeiro gourmet com chocolate belga', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32', 4, 50, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Inserir configurações padrão
INSERT INTO settings (name, value, type) VALUES 
('store_name', 'Sweet Cakes', 'string'),
('store_address', 'Rua das Flores, 123', 'string'),
('store_phone', '(11) 98765-4321', 'string'),
('store_email', 'contato@sweetcakes.com', 'string'),
('delivery_fee', '10.00', 'number'),
('min_order_value', '30.00', 'number'),
('delivery_time', '40-60 minutos', 'string'),
('opening_hours', JSON_OBJECT(
    'monday', JSON_OBJECT('open', '08:00', 'close', '18:00'),
    'tuesday', JSON_OBJECT('open', '08:00', 'close', '18:00'),
    'wednesday', JSON_OBJECT('open', '08:00', 'close', '18:00'),
    'thursday', JSON_OBJECT('open', '08:00', 'close', '18:00'),
    'friday', JSON_OBJECT('open', '08:00', 'close', '18:00'),
    'saturday', JSON_OBJECT('open', '09:00', 'close', '15:00'),
    'sunday', JSON_OBJECT('open', 'closed', 'close', 'closed')
), 'json'),
('accept_orders', 'true', 'boolean'),
('maintenance_mode', 'false', 'boolean'),
('social_media', JSON_OBJECT(
    'facebook', 'https://facebook.com/sweetcakes',
    'instagram', 'https://instagram.com/sweetcakes',
    'whatsapp', '5511987654321'
), 'json')
ON DUPLICATE KEY UPDATE name = VALUES(name); 
USE cake_shop;

-- Inserir categorias
INSERT INTO categories (name, description, active) VALUES
('Bolos Tradicionais', 'Bolos clássicos para todas as ocasiões', 1),
('Bolos Decorados', 'Bolos com decorações especiais para festas', 1),
('Cupcakes', 'Deliciosos cupcakes em diversos sabores', 1),
('Doces', 'Variedade de doces tradicionais', 1),
('Tortas', 'Tortas doces e salgadas', 1);

-- Inserir produtos
INSERT INTO products (name, price, description, image, categoryId, stock, active) VALUES
('Bolo de Chocolate', 45.00, 'Delicioso bolo de chocolate com cobertura de ganache', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', 1, 10, 1),
('Bolo de Cenoura', 40.00, 'Bolo de cenoura com cobertura de chocolate', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187', 1, 8, 1),
('Bolo de Morango', 50.00, 'Bolo recheado com creme e morangos frescos', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d', 1, 5, 1),
('Bolo de Aniversário', 65.00, 'Bolo festivo decorado com confeitos coloridos', 'https://images.unsplash.com/photo-1535141192574-5d4897c12636', 2, 3, 1),
('Bolo de Casamento', 120.00, 'Elegante bolo de dois andares com decoração clássica', 'https://images.unsplash.com/photo-1519654793309-4b17cdb33d14', 2, 2, 1),
('Cupcake de Chocolate', 8.00, 'Cupcake de chocolate com cobertura de creme', 'https://images.unsplash.com/photo-1603532648955-039310d9ed75', 3, 20, 1),
('Cupcake de Baunilha', 8.00, 'Cupcake de baunilha com cobertura de buttercream', 'https://images.unsplash.com/photo-1615832494579-d2ad3f35310b', 3, 15, 1),
('Brigadeiro', 2.50, 'Tradicional brigadeiro brasileiro', 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3', 4, 50, 1),
('Beijinho', 2.50, 'Docinho de coco', 'https://images.unsplash.com/photo-1497114046243-9c6db2a2f4f2', 4, 50, 1),
('Torta de Limão', 45.00, 'Torta de limão com massa crocante e cobertura de merengue', 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff', 5, 7, 1),
('Torta de Maçã', 40.00, 'Torta tradicional de maçã com canela', 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6', 5, 6, 1);

-- Inserir pedidos de exemplo
INSERT INTO orders (customerName, customerPhone, customerAddress, total, status, createdAt) VALUES
('João Silva', '11999887766', 'Rua das Flores, 123 - São Paulo, SP', 93.00, 'delivered', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Maria Oliveira', '11988776655', 'Avenida Paulista, 1000 - São Paulo, SP', 120.00, 'confirmed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Pedro Santos', '11977665544', 'Rua Augusta, 500 - São Paulo, SP', 45.00, 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Inserir itens dos pedidos
-- Pedido 1
INSERT INTO order_items (orderId, productId, quantity, price) VALUES
(1, 1, 1, 45.00),
(1, 6, 6, 8.00);

-- Pedido 2
INSERT INTO order_items (orderId, productId, quantity, price) VALUES
(2, 5, 1, 120.00);

-- Pedido 3
INSERT INTO order_items (orderId, productId, quantity, price) VALUES
(3, 10, 1, 45.00); 
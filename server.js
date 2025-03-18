const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cake_shop',
};

// Pool de conexões com o banco de dados
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Teste de conexão com o banco de dados
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', message: 'Conexão com o banco de dados estabelecida com sucesso!' });
  } catch (error) {
    console.error('Erro de conexão com o banco de dados:', error);
    res.status(500).json({ status: 'error', message: 'Erro de conexão com o banco de dados', error: error.message });
  }
});

// === API de Autenticação ===
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
    }
    
    const [rows] = await pool.query(
      'SELECT id, username, name, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição', error: error.message });
  }
});

// === API de Categorias ===
// Listar todas as categorias
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
  }
});

// Buscar categoria por ID
app.get('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar categoria com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar categoria', error: error.message });
  }
});

// Criar categoria
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description, active } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, description, active) VALUES (?, ?, ?)',
      [name, description, active ? 1 : 0]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      description,
      active
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
  }
});

// Atualizar categoria
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    
    if (active !== undefined) {
      fields.push('active = ?');
      values.push(active ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }
    
    values.push(id);
    
    const [result] = await pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error(`Erro ao atualizar categoria com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
  }
});

// Excluir categoria
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir categoria com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao excluir categoria', error: error.message });
  }
});

// === API de Produtos ===
// Listar todos os produtos
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as categoryName 
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
    `);
    
    res.json(rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      active: Boolean(row.active)
    })));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Buscar produto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
      SELECT p.*, c.name as categoryName 
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    const product = {
      ...rows[0],
      price: parseFloat(rows[0].price),
      active: Boolean(rows[0].active)
    };
    
    res.json(product);
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
});

// Criar produto
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description, image, categoryId, stock, active } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Nome e preço do produto são obrigatórios' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO products 
       (name, price, description, image, categoryId, stock, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, price, description, image, categoryId, stock || 0, active ? 1 : 0]
    );
    
    // Buscar o produto completo para retornar
    const [rows] = await pool.query(`
      SELECT p.*, c.name as categoryName 
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?
    `, [result.insertId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Erro ao recuperar o produto criado' });
    }
    
    const product = {
      ...rows[0],
      price: parseFloat(rows[0].price),
      active: Boolean(rows[0].active)
    };
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

// Atualizar produto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, categoryId, stock, active } = req.body;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    
    if (image !== undefined) {
      fields.push('image = ?');
      values.push(image);
    }
    
    if (categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(categoryId);
    }
    
    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }
    
    if (active !== undefined) {
      fields.push('active = ?');
      values.push(active ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }
    
    values.push(id);
    
    const [result] = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

// Excluir produto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir produto com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
  }
});

// === API de Pedidos ===
// Listar todos os pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const [orderRows] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
    
    const orders = [];
    
    for (const order of orderRows) {
      // Buscar os itens do pedido
      const [itemRows] = await pool.query(`
        SELECT oi.*, p.name, p.price, p.image, p.description 
        FROM order_items oi
        JOIN products p ON oi.productId = p.id
        WHERE oi.orderId = ?
      `, [order.id]);
      
      const items = itemRows.map(item => ({
        product: {
          id: item.productId,
          name: item.name,
          price: parseFloat(item.price),
          description: item.description,
          image: item.image,
          categoryId: 0,
          stock: 0,
          active: true
        },
        quantity: item.quantity
      }));
      
      orders.push({
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        items,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      });
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
});

// Buscar pedido por ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    const order = orderRows[0];
    
    // Buscar os itens do pedido
    const [itemRows] = await pool.query(`
      SELECT oi.*, p.name, p.price, p.image, p.description 
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `, [id]);
    
    const items = itemRows.map(item => ({
      product: {
        id: item.productId,
        name: item.name,
        price: parseFloat(item.price),
        description: item.description,
        image: item.image,
        categoryId: 0,
        stock: 0,
        active: true
      },
      quantity: item.quantity
    }));
    
    res.json({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      items,
      total: parseFloat(order.total),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (error) {
    console.error(`Erro ao buscar pedido com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
});

// Criar pedido
app.post('/api/orders', async (req, res) => {
  // Iniciar uma transação
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const { customerName, customerPhone, customerAddress, items, total, status = 'pending' } = req.body;
    
    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: 'Dados incompletos para criar o pedido' });
    }
    
    // Inserir o pedido
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (customerName, customerPhone, customerAddress, total, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [customerName, customerPhone, customerAddress, total, status]
    );
    
    const orderId = orderResult.insertId;
    
    // Inserir os itens do pedido
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (orderId, productId, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product.id, item.quantity, item.product.price]
      );
      
      // Atualizar o estoque do produto
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product.id, item.quantity]
      );
    }
    
    // Comitar a transação
    await connection.commit();
    connection.release();
    
    res.status(201).json({
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      total,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    // Reverter a transação em caso de erro
    await connection.rollback();
    connection.release();
    
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
});

// Atualizar status do pedido
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.json({ message: 'Status do pedido atualizado com sucesso' });
  } catch (error) {
    console.error(`Erro ao atualizar status do pedido com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: error.message });
  }
});

// === API de Configurações ===
// Listar todas as configurações
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings ORDER BY name');
    
    const settings = {};
    
    for (const row of rows) {
      let value = row.value;
      
      // Converter o valor conforme o tipo
      if (row.type === 'number') {
        value = parseFloat(value);
      } else if (row.type === 'boolean') {
        value = value === 'true';
      } else if (row.type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.error(`Erro ao analisar valor JSON para ${row.name}:`, e);
        }
      }
      
      settings[row.name] = value;
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações', error: error.message });
  }
});

// Buscar configuração por nome
app.get('/api/settings/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const [rows] = await pool.query('SELECT * FROM settings WHERE name = ?', [name]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Configuração não encontrada' });
    }
    
    const setting = rows[0];
    let value = setting.value;
    
    // Converter o valor conforme o tipo
    if (setting.type === 'number') {
      value = parseFloat(value);
    } else if (setting.type === 'boolean') {
      value = value === 'true';
    } else if (setting.type === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error(`Erro ao analisar valor JSON para ${setting.name}:`, e);
      }
    }
    
    res.json({
      name: setting.name,
      value,
      type: setting.type
    });
  } catch (error) {
    console.error(`Erro ao buscar configuração ${req.params.name}:`, error);
    res.status(500).json({ message: 'Erro ao buscar configuração', error: error.message });
  }
});

// Atualizar configuração
app.put('/api/settings/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { value, type } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ message: 'Valor da configuração é obrigatório' });
    }
    
    // Verificar se a configuração existe
    const [existingRows] = await pool.query('SELECT * FROM settings WHERE name = ?', [name]);
    
    let processedValue = value;
    let processedType = type;
    
    // Se a configuração não existir, inferir o tipo
    if (existingRows.length === 0) {
      if (!processedType) {
        if (typeof value === 'number') {
          processedType = 'number';
        } else if (typeof value === 'boolean') {
          processedType = 'boolean';
        } else if (typeof value === 'object') {
          processedType = 'json';
          processedValue = JSON.stringify(value);
        } else {
          processedType = 'string';
        }
      }
      
      // Criar a configuração
      const [insertResult] = await pool.query(
        'INSERT INTO settings (name, value, type) VALUES (?, ?, ?)',
        [name, processedValue.toString(), processedType]
      );
      
      return res.status(201).json({ 
        name, 
        value: processedValue,
        type: processedType
      });
    }
    
    // Obter o tipo atual da configuração
    const existingType = processedType || existingRows[0].type;
    
    // Processar o valor conforme o tipo
    if (existingType === 'json' && typeof value === 'object') {
      processedValue = JSON.stringify(value);
    } else if (typeof processedValue !== 'string') {
      processedValue = processedValue.toString();
    }
    
    // Atualizar a configuração
    const [updateResult] = await pool.query(
      'UPDATE settings SET value = ?, updated_at = NOW() WHERE name = ?',
      [processedValue, name]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Configuração não encontrada' });
    }
    
    res.json({ 
      name, 
      value: processedValue === 'true' ? true : 
             processedValue === 'false' ? false : 
             existingType === 'number' ? parseFloat(processedValue) : 
             existingType === 'json' ? JSON.parse(processedValue) : processedValue,
      type: existingType
    });
  } catch (error) {
    console.error(`Erro ao atualizar configuração ${req.params.name}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar configuração', error: error.message });
  }
});

// Excluir configuração
app.delete('/api/settings/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const [result] = await pool.query('DELETE FROM settings WHERE name = ?', [name]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Configuração não encontrada' });
    }
    
    res.json({ message: 'Configuração excluída com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir configuração ${req.params.name}:`, error);
    res.status(500).json({ message: 'Erro ao excluir configuração', error: error.message });
  }
});

// Rota para servir o aplicativo React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API de saúde disponível em http://localhost:${PORT}/api/health`);
}); 
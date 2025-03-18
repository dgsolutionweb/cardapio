import Database from '../utils/db';
import { Order, CartItem } from '../types';
import { ResultSetHeader } from 'mysql2';
import mysql from 'mysql2';

class OrderService {
  // Busca todos os pedidos
  static async getAllOrders(): Promise<Order[]> {
    try {
      const [rows] = await Database.query('SELECT * FROM orders ORDER BY createdAt DESC');
      
      const orders: Order[] = [];
      
      for (const row of rows as any[]) {
        // Buscar os itens do pedido
        const [itemRows] = await Database.query(
          `SELECT oi.*, p.name, p.price, p.image, p.description 
           FROM order_items oi
           JOIN products p ON oi.productId = p.id
           WHERE oi.orderId = ?`,
          [row.id]
        );
        
        const items = (itemRows as any[]).map(item => ({
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
          id: row.id,
          customerName: row.customerName,
          customerPhone: row.customerPhone,
          customerAddress: row.customerAddress,
          items,
          total: parseFloat(row.total),
          status: row.status,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt)
        });
      }
      
      return orders;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  }

  // Busca um pedido pelo ID
  static async getOrderById(id: number): Promise<Order | null> {
    try {
      const [rows] = await Database.query('SELECT * FROM orders WHERE id = ?', [id]);
      
      if ((rows as any[]).length === 0) {
        return null;
      }
      
      const order = (rows as any[])[0];
      
      // Buscar os itens do pedido
      const [itemRows] = await Database.query(
        `SELECT oi.*, p.name, p.price, p.image, p.description 
         FROM order_items oi
         JOIN products p ON oi.productId = p.id
         WHERE oi.orderId = ?`,
        [id]
      );
      
      const items = (itemRows as any[]).map(item => ({
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
      
      return {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        items,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt)
      };
    } catch (error) {
      console.error(`Erro ao buscar pedido com ID ${id}:`, error);
      return null;
    }
  }

  // Cria um novo pedido
  static async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    total: number;
  }): Promise<Order | null> {
    const connection = await Database.getPool().getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Inserir pedido
      const [orderResult] = await connection.query(
        `INSERT INTO orders 
         (customerName, customerPhone, customerAddress, total, status, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [
          orderData.customerName,
          orderData.customerPhone,
          orderData.customerAddress,
          orderData.total
        ]
      ) as any;
      
      const orderId = orderResult.insertId;
      
      // Inserir itens do pedido
      for (const item of orderData.items) {
        await connection.query(
          `INSERT INTO order_items (orderId, productId, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [
            orderId,
            item.product.id,
            item.quantity,
            item.product.price
          ]
        );
        
        // Atualizar estoque do produto
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
          [item.quantity, item.product.id, item.quantity]
        );
      }
      
      await connection.commit();
      
      // Retornar o pedido criado
      return {
        id: orderId,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      await connection.rollback();
      console.error('Erro ao criar pedido:', error);
      return null;
    } finally {
      connection.release();
    }
  }

  // Atualiza o status de um pedido
  static async updateOrderStatus(id: number, status: Order['status']): Promise<boolean> {
    try {
      const sql = 'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?';
      await Database.query(sql, [status, id]);
      
      // Se não gerou erro, assumimos que atualizou com sucesso
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${id}:`, error);
      return false;
    }
  }

  // Exclui um pedido
  static async deleteOrder(id: number): Promise<boolean> {
    try {
      // Iniciar uma transação
      const connection = await Database.getPool().getConnection();
      await connection.beginTransaction();
      
      try {
        // Excluir os itens do pedido
        await connection.query(
          'DELETE FROM order_items WHERE orderId = ?',
          [id]
        );
        
        // Excluir o pedido
        const [result] = await connection.query(
          'DELETE FROM orders WHERE id = ?',
          [id]
        );
        
        // Comitar a transação
        await connection.commit();
        
        // O tipo resultante é tratado como any para acessar affectedRows
        return (result as any).affectedRows > 0;
      } catch (error) {
        // Reverter a transação em caso de erro
        await connection.rollback();
        throw error;
      } finally {
        // Liberar a conexão
        connection.release();
      }
    } catch (error) {
      console.error(`Erro ao excluir pedido com ID ${id}:`, error);
      throw error;
    }
  }
}

export default OrderService; 
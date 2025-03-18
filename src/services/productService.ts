import Database from '../utils/db';
import { Product } from '../types';

class ProductService {
  // Busca todos os produtos
  static async getAllProducts(): Promise<Product[]> {
    try {
      const [rows] = await Database.query<any[]>(`
        SELECT p.*, c.name as categoryName 
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
      `);
      
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        description: row.description,
        image: row.image,
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        stock: row.stock,
        active: Boolean(row.active)
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // Busca um produto pelo ID
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const [rows] = await Database.query<any[]>(`
        SELECT p.*, c.name as categoryName 
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        WHERE p.id = ?
      `, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        description: row.description,
        image: row.image,
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        stock: row.stock,
        active: Boolean(row.active)
      };
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error);
      throw error;
    }
  }

  // Busca produtos por categoria
  static async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const [rows] = await Database.query<any[]>(`
        SELECT p.*, c.name as categoryName 
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        WHERE p.categoryId = ?
      `, [categoryId]);
      
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        description: row.description,
        image: row.image,
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        stock: row.stock,
        active: Boolean(row.active)
      }));
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${categoryId}:`, error);
      throw error;
    }
  }

  // Cria um novo produto
  static async createProduct(product: Omit<Product, 'id' | 'categoryName'>): Promise<number> {
    try {
      const [result] = await Database.query<any>(
        `INSERT INTO products 
         (name, price, description, image, categoryId, stock, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.price,
          product.description,
          product.image,
          product.categoryId,
          product.stock,
          product.active ? 1 : 0
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Atualiza um produto existente
  static async updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'categoryName'>>): Promise<boolean> {
    try {
      const fields = [];
      const values = [];
      
      if (product.name !== undefined) {
        fields.push('name = ?');
        values.push(product.name);
      }
      
      if (product.price !== undefined) {
        fields.push('price = ?');
        values.push(product.price);
      }
      
      if (product.description !== undefined) {
        fields.push('description = ?');
        values.push(product.description);
      }
      
      if (product.image !== undefined) {
        fields.push('image = ?');
        values.push(product.image);
      }
      
      if (product.categoryId !== undefined) {
        fields.push('categoryId = ?');
        values.push(product.categoryId);
      }
      
      if (product.stock !== undefined) {
        fields.push('stock = ?');
        values.push(product.stock);
      }
      
      if (product.active !== undefined) {
        fields.push('active = ?');
        values.push(product.active ? 1 : 0);
      }
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const [result] = await Database.query<any>(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error);
      throw error;
    }
  }

  // Exclui um produto
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'DELETE FROM products WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao excluir produto com ID ${id}:`, error);
      throw error;
    }
  }

  // Ativa ou desativa um produto
  static async toggleProductStatus(id: number, active: boolean): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'UPDATE products SET active = ? WHERE id = ?',
        [active ? 1 : 0, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao alterar status do produto com ID ${id}:`, error);
      throw error;
    }
  }

  // Atualiza o estoque de um produto
  static async updateProductStock(id: number, quantity: number): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [quantity, id, quantity]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao atualizar estoque do produto com ID ${id}:`, error);
      throw error;
    }
  }
}

export default ProductService; 
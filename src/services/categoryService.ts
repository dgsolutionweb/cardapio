import Database from '../utils/db';
import { Category } from '../types';

class CategoryService {
  // Busca todas as categorias
  static async getAllCategories(): Promise<Category[]> {
    try {
      const [rows] = await Database.query<any[]>('SELECT * FROM categories');
      return rows as Category[];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  // Busca uma categoria pelo ID
  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const [rows] = await Database.query<any[]>(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0] as Category;
    } catch (error) {
      console.error(`Erro ao buscar categoria com ID ${id}:`, error);
      throw error;
    }
  }

  // Cria uma nova categoria
  static async createCategory(category: Omit<Category, 'id'>): Promise<number> {
    try {
      const [result] = await Database.query<any>(
        'INSERT INTO categories (name, description, active) VALUES (?, ?, ?)',
        [category.name, category.description, category.active ? 1 : 0]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  // Atualiza uma categoria existente
  static async updateCategory(id: number, category: Partial<Category>): Promise<boolean> {
    try {
      const fields = [];
      const values = [];
      
      if (category.name !== undefined) {
        fields.push('name = ?');
        values.push(category.name);
      }
      
      if (category.description !== undefined) {
        fields.push('description = ?');
        values.push(category.description);
      }
      
      if (category.active !== undefined) {
        fields.push('active = ?');
        values.push(category.active ? 1 : 0);
      }
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const [result] = await Database.query<any>(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao atualizar categoria com ID ${id}:`, error);
      throw error;
    }
  }

  // Exclui uma categoria
  static async deleteCategory(id: number): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'DELETE FROM categories WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao excluir categoria com ID ${id}:`, error);
      throw error;
    }
  }

  // Ativa ou desativa uma categoria
  static async toggleCategoryStatus(id: number, active: boolean): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'UPDATE categories SET active = ? WHERE id = ?',
        [active ? 1 : 0, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao alterar status da categoria com ID ${id}:`, error);
      throw error;
    }
  }
}

export default CategoryService; 
import Database from '../utils/db';
import { AdminUser } from '../types';

class AuthService {
  // Autentica um usuário administrativo
  static async login(username: string, password: string): Promise<AdminUser | null> {
    try {
      const [rows] = await Database.query<any[]>(
        'SELECT id, username, name, role FROM users WHERE username = ? AND password = ?',
        [username, password]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return {
        id: rows[0].id,
        username: rows[0].username,
        name: rows[0].name,
        role: rows[0].role
      };
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      throw error;
    }
  }

  // Busca um usuário pelo ID
  static async getUserById(id: number): Promise<AdminUser | null> {
    try {
      const [rows] = await Database.query<any[]>(
        'SELECT id, username, name, role FROM users WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return {
        id: rows[0].id,
        username: rows[0].username,
        name: rows[0].name,
        role: rows[0].role
      };
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  // Obtém todos os usuários administrativos
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const [rows] = await Database.query<any[]>(
        'SELECT id, username, name, role FROM users'
      );
      
      return rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        name: row.name,
        role: row.role
      }));
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw error;
    }
  }

  // Cria um novo usuário administrativo
  static async createUser(user: Omit<AdminUser, 'id'> & { password: string }): Promise<number> {
    try {
      const [result] = await Database.query<any>(
        'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        [user.username, user.password, user.name, user.role]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualiza um usuário administrativo
  static async updateUser(id: number, user: Partial<AdminUser> & { password?: string }): Promise<boolean> {
    try {
      const fields = [];
      const values = [];
      
      if (user.username !== undefined) {
        fields.push('username = ?');
        values.push(user.username);
      }
      
      if (user.password !== undefined) {
        fields.push('password = ?');
        values.push(user.password);
      }
      
      if (user.name !== undefined) {
        fields.push('name = ?');
        values.push(user.name);
      }
      
      if (user.role !== undefined) {
        fields.push('role = ?');
        values.push(user.role);
      }
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const [result] = await Database.query<any>(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  // Exclui um usuário administrativo
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const [result] = await Database.query<any>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error);
      throw error;
    }
  }
}

export default AuthService; 
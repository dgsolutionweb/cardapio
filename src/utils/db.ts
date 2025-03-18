import mysql from 'mysql2/promise';

class Database {
  private static pool: mysql.Pool | null = null;

  // Obtém o pool de conexões
  static getPool(): mysql.Pool {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cake_shop',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return this.pool;
  }

  // Obtém uma conexão do pool
  static async getConnection(): Promise<mysql.PoolConnection> {
    return this.getPool().getConnection();
  }

  // Executa uma consulta no banco de dados
  static async query<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    const pool = this.getPool();
    try {
      const result = await pool.query(sql, params);
      return result as unknown as [T, any];
    } catch (error) {
      console.error('Erro ao executar consulta SQL:', error);
      throw error;
    }
  }

  // Fecha o pool de conexões
  static async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export default Database; 
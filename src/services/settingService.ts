import { Setting, StoreSettings } from '../types';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class SettingService {
  // Busca todas as configurações
  static async getAllSettings(): Promise<StoreSettings> {
    try {
      const response = await fetch(`${API_URL}/settings`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar configurações: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }
  }

  // Busca uma configuração específica
  static async getSetting(name: string): Promise<Setting> {
    try {
      const response = await fetch(`${API_URL}/settings/${name}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar configuração ${name}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar configuração ${name}:`, error);
      throw error;
    }
  }

  // Atualiza uma configuração
  static async updateSetting(name: string, value: any, type?: string): Promise<Setting> {
    try {
      const response = await fetch(`${API_URL}/settings/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value, type }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar configuração ${name}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar configuração ${name}:`, error);
      throw error;
    }
  }

  // Exclui uma configuração
  static async deleteSetting(name: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/settings/${name}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir configuração ${name}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erro ao excluir configuração ${name}:`, error);
      throw error;
    }
  }

  // Atualiza múltiplas configurações de uma vez
  static async updateSettings(settings: Partial<StoreSettings>): Promise<void> {
    try {
      const promises = Object.entries(settings).map(([name, value]) => 
        this.updateSetting(name, value)
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }
}

export default SettingService; 
import axios from 'axios';
import { Place, Tag, UserStats } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const placesApi = {
  // Получить все места
  getPlaces: async (category?: string, tags?: string[]): Promise<Place[]> => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (tags && tags.length > 0) params.append('tags', tags.join(','));
      
      const response = await api.get(`/places?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении мест:', error);
      return [];
    }
  },

  // Добавить новое место
  addPlace: async (place: Omit<Place, 'id'>): Promise<{ success: boolean; id?: string }> => {
    try {
      const placeData = {
        id: `place-${Date.now()}`,
        ...place,
      };
      const response = await api.post('/places', placeData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении места:', error);
      return { success: false };
    }
  },

  // Обновить место
  updatePlace: async (id: string, place: Partial<Place>): Promise<{ success: boolean }> => {
    try {
      const response = await api.put(`/places/${id}`, place);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении места:', error);
      return { success: false };
    }
  },

  // Удалить место
  deletePlace: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/places/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении места:', error);
      return { success: false };
    }
  },
};

export const tagsApi = {
  // Получить все теги
  getTags: async (): Promise<Tag[]> => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении тегов:', error);
      return [];
    }
  },
};

export const userApi = {
  // Получить статистику пользователя
  getUserStats: async (userId: string): Promise<Partial<UserStats> | null> => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статистики пользователя:', error);
      return null;
    }
  },

  // Обновить статистику пользователя
  updateUserStats: async (userId: string, stats: Partial<UserStats>): Promise<{ success: boolean }> => {
    try {
      const response = await api.post(`/users/${userId}/stats`, stats);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении статистики пользователя:', error);
      return { success: false };
    }
  },
};

// Функция для генерации уникального ID пользователя
export const getUserId = (): string => {
  let userId = localStorage.getItem('saratov-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('saratov-user-id', userId);
  }
  return userId;
};

export default api;

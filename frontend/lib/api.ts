import axios from 'axios';
import { SearchResponse, SearchQuery, PopularTerm } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  static async searchPodcasts(query: SearchQuery): Promise<SearchResponse> {
    try {
      const response = await api.get('/search', {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw new Error('Failed to search podcasts. Please try again.');
    }
  }

  static async getSearchHistory(term?: string): Promise<SearchResponse> {
    try {
      const response = await api.get('/search/history', {
        params: term ? { term } : {},
      });
      return response.data;
    } catch (error) {
      console.error('History API error:', error);
      throw new Error('Failed to fetch search history.');
    }
  }

  static async getPopularTerms(): Promise<{ success: boolean; data: PopularTerm[] }> {
    try {
      const response = await api.get('/search/popular-terms');
      return response.data;
    } catch (error) {
      console.error('Popular terms API error:', error);
      throw new Error('Failed to fetch popular search terms.');
    }
  }

  static async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error('API is not available.');
    }
  }
}

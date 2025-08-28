import axios, { AxiosError } from 'axios';
import { SearchResponse, SearchQuery, PopularTerm } from '@/types';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  private static handleApiError(error: unknown, defaultMessage: string): never {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        const details = error.response.data.details;
        toast.error(details || errorMessage);
        throw new Error(errorMessage);
      } else if (error.message === 'Network Error') {
        const message = 'Unable to connect to server. Please check your connection.';
        toast.error(message);
        throw new Error(message);
      } else if (error.code === 'ECONNABORTED') {
        const message = 'Request timeout. Please try again.';
        toast.error(message);
        throw new Error(message);
      }
    }
    
    console.error('API Error:', error);
    toast.error(defaultMessage);
    throw new Error(defaultMessage);
  }

  static async searchPodcasts(query: SearchQuery): Promise<SearchResponse> {
    try {
      // Validate query on client side
      if (!query.term || query.term.trim().length < 2) {
        const message = 'Search term must be at least 2 characters long';
        toast.error(message);
        throw new Error(message);
      }

      toast.loading('Searching iTunes...', { id: 'search' });
      
      const response = await api.get('/search', {
        params: query,
      });
      
      toast.success(`Found ${response.data.count} results!`, { id: 'search' });
      return response.data;
    } catch (error) {
      toast.dismiss('search');
      this.handleApiError(error, 'Failed to search podcasts. Please try again.');
    }
  }

  static async getSearchHistory(term?: string): Promise<SearchResponse> {
    try {
      const response = await api.get('/search/history', {
        params: term ? { term } : {},
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to fetch search history.');
    }
  }

  static async getPopularTerms(): Promise<{ success: boolean; data: PopularTerm[] }> {
    try {
      const response = await api.get('/search/popular-terms');
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to fetch popular search terms.');
    }
  }

  static async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'API is not available.');
    }
  }
}

// API Service for Vercel deployment
export interface PodcastResult {
  id: string;
  track_id: number;
  track_name: string;
  artist_name: string;
  description: string;
  primary_genre_name: string;
  artwork_url_100: string;
  artwork_url_600: string;
  track_view_url: string;
  release_date: string;
  country: string;
  kind: string;
  track_count: number;
}

export interface SearchResponse {
  results: PodcastResult[];
  resultCount: number;
  searchTerm: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    // Use relative URLs for Vercel deployment
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? '' // Same domain in production
      : 'http://localhost:3000'; // Local development
  }

  async searchPodcasts(searchTerm: string, limit: number = 50): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/search?term=${encodeURIComponent(searchTerm)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
  }

  async checkHealth(): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;

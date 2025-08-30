export interface Podcast {
  id: string;
  track_id: number;
  track_name: string;
  artist_name: string;
  description?: string;
  primary_genre_name?: string;
  artwork_url_100?: string;
  artwork_url_600?: string;
  track_view_url?: string;
  release_date?: string;
  country?: string;
  kind?: string;
  track_count?: number;
  search_term?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchResponse {
  success: boolean;
  data: Podcast[];
  count: number;
  searchTerm?: string;
}

export interface PopularTerm {
  search_term: string;
  count: number;
}

export interface SearchQuery {
  term: string;
  media?: string;
  country?: string;
  limit?: number;
}

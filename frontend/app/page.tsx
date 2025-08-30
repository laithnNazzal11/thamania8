'use client';

import { useState, useEffect } from 'react';
import { Podcast } from '@/types';
import { ApiService } from '@/lib/api';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';

export default function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const [trendingPodcasts, setTrendingPodcasts] = useState<Podcast[]>([]);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setSearchTerm(term);
    setHasSearched(true);

    try {
      const response = await ApiService.searchPodcasts({ term });
      setPodcasts(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to search podcasts');
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load recent searches
        const searchHistory = await ApiService.getSearchHistory();
        if (searchHistory.data.length > 0) {
          setPodcasts(searchHistory.data.slice(0, 12));
        }

        // Load popular terms
        const popularResponse = await ApiService.getPopularTerms();
        if (popularResponse.data.length > 0) {
          setPopularTerms(popularResponse.data.slice(0, 6).map(item => item.search_term));
        }

        // Load trending content by searching for "technology"
        const trendingResponse = await ApiService.searchPodcasts({ term: 'technology', limit: 6 });
        setTrendingPodcasts(trendingResponse.data);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  const genres = [
    { name: 'All genres', color: 'from-pink-400 to-purple-500' },
    { name: 'Arts', color: 'from-red-400 to-pink-500' },
    { name: 'Comedy', color: 'from-orange-400 to-red-500' },
    { name: 'Education', color: 'from-yellow-400 to-orange-500' },
    { name: 'Technology', color: 'from-green-400 to-blue-500' },
    { name: 'TV & Film', color: 'from-blue-400 to-purple-500' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Modern Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  PodSearch
                </h1>
                <p className="text-sm text-gray-400">
                  Discover amazing podcasts
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Built for <span className="text-blue-400 font-medium">Thamanea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading}
            initialValue={searchTerm}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {hasSearched ? (
          <SearchResults 
            podcasts={podcasts} 
            loading={loading} 
            error={error || ""}
            searchTerm={searchTerm}
          />
        ) : (
          <div className="space-y-12">
            {/* Trending Podcasts */}
            {trendingPodcasts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Trending podcasts in all genres
                  </h2>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-400 mb-8">The most popular podcasts overall now. Last updated 2 hours ago.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {trendingPodcasts.map((podcast, index) => (
                    <div key={podcast.id} className="group">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                        {podcast.artwork_url_600 ? (
                          <img
                            src={podcast.artwork_url_600}
                            alt={podcast.track_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {podcast.track_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-sm font-bold">#{index + 1}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {podcast.track_name}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {podcast.artist_name}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Browse by Genre */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Browse by genre
                </h2>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 mb-8">The most popular podcasts and episodes now categorized by genre. Last updated 2 hours ago.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {genres.map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => handleSearch(genre.name.toLowerCase())}
                    className={`group relative h-32 rounded-xl bg-gradient-to-br ${genre.color} p-4 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  >
                    <div className="absolute inset-0 bg-black/20 rounded-xl group-hover:bg-black/10 transition-colors" />
                    <div className="relative z-10">
                      <div className="absolute top-2 right-2 opacity-20">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {genre.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            {podcasts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Recent searches
                  </h2>
                </div>
                <p className="text-gray-400 mb-8">Your recent podcast discoveries.</p>
                <SearchResults podcasts={podcasts.slice(0, 6)} />
              </section>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              PodSearch v2.9.8 by Laith Nazzal • Built with Next.js, TypeScript & Tailwind CSS
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Created for Thamanea (ثمانية) Job Application • All Podcasts
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
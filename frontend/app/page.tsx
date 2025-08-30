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
    <div className="min-h-screen bg-[#141523] flex">
      {/* Sidebar */}
      <div className="max-w-[219px] w-full bg-[#141523] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-400 bg-purple-500/10">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
              <span className="font-medium">Home</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-400">🧭</span>
              </div>
              <span>Discover</span>
            </a>
          </div>

          {/* Your Stuff Section */}
          <div className="pt-6">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3 px-3">
              YOUR STUFF
            </h3>
            <div className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-400">📋</span>
                </div>
                <span>My Queue</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-400">📱</span>
                </div>
                <span>My Podcasts</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-400">🕒</span>
                </div>
                <span>Recents</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-left">
            <p className="text-gray-400 text-sm">
              Podbay v2.9.8 by Fancy Soups.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              About • All Podcasts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-[#141523] border-b border-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Centered Search Bar */}
              <div className="flex-1 mx-4">
                <SearchForm 
                  onSearch={handleSearch} 
                  loading={loading}
                  initialValue={searchTerm}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="bg-[#375e83] hover:bg-[#2d4a6b] text-white px-4 h-8 rounded-lg text-sm font-medium transition-colors">
                  Log in
                </button>
                <button className="bg-[#375e83] hover:bg-[#2d4a6b] text-white px-4 h-8 rounded-lg text-sm font-medium transition-colors">
                  Sign up
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#141523]">
          {/* Content Sections */}
          <div className="max-w-7xl mx-auto px-6 py-8">
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
        </div>
      </div>
    </div>
  );
}
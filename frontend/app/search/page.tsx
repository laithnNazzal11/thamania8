'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Podcast } from '@/types';
import { ApiService } from '@/lib/api';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  // Get initial search term from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      const decodedTerm = decodeURIComponent(q);
      setSearchTerm(decodedTerm);
      handleSearch(decodedTerm);
    }
  }, [searchParams]);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setSearchTerm(term);
    setHasSearched(true);

    // Update URL with search term
    const url = new URL(window.location.href);
    url.searchParams.set('q', encodeURIComponent(term));
    router.replace(url.pathname + url.search);

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
            <a href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-400">🏠</span>
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
                <button 
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => router.forward()}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
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
          <div className="max-w-7xl mx-auto px-6 py-8">
            {hasSearched ? (
              <div>
                {/* Search Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {searchTerm ? `Search results for "${searchTerm}"` : 'Search Results'}
                  </h1>
                  {podcasts.length > 0 && (
                    <p className="text-gray-400">
                      Found {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                {/* Search Results */}
                <SearchResults 
                  podcasts={podcasts} 
                  loading={loading} 
                  error={error || ""}
                  searchTerm={searchTerm}
                />
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Search for podcasts
                  </h1>
                  <p className="text-gray-400 text-lg mb-8">
                    Start typing in the search bar above to find your favorite podcasts and episodes from over 70 million available.
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['فنجان', 'Technology', 'Comedy', 'News', 'Education'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

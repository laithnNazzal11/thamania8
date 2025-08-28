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

  // Load recent searches on component mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const response = await ApiService.getSearchHistory();
        if (response.data.length > 0) {
          setPodcasts(response.data.slice(0, 12)); // Show last 12 results
        }
      } catch (err) {
        console.error('Failed to load recent searches:', err);
      }
    };

    loadRecentSearches();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              iTunes Search
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing podcasts, music, and media content from iTunes. 
              Search, explore, and find your next favorite show.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Built for <span className="font-semibold text-blue-600">Thamanea (ثمانية)</span> • Assignment Demo
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchForm 
          onSearch={handleSearch} 
          loading={loading}
          initialValue={searchTerm}
        />
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {hasSearched ? (
          <SearchResults 
            podcasts={podcasts} 
            loading={loading} 
            error={error || ""}
            searchTerm={searchTerm}
          />
        ) : (
          <div className="text-center">
            {podcasts.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Searches
                </h2>
                <SearchResults podcasts={podcasts} />
              </div>
            ) : (
              <div className="py-16">
                <div className="text-6xl mb-6">🎧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Discover Amazing Content?
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Search for your favorite podcasts, artists, or explore new content from iTunes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-2xl mb-2">🎙️</div>
                    <h3 className="font-semibold mb-2">Podcasts</h3>
                    <p className="text-gray-600">Discover talk shows, news, and storytelling</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-2xl mb-2">🎵</div>
                    <h3 className="font-semibold mb-2">Music</h3>
                    <p className="text-gray-600">Find albums, artists, and songs</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-semibold mb-2">Audiobooks</h3>
                    <p className="text-gray-600">Explore books and educational content</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 iTunes Search Application • Built with Next.js, TypeScript & Tailwind CSS
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Created by Laith Nazzal for Thamanea Job Application
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
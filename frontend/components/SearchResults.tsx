'use client';

import { Podcast } from '@/types';
import PodcastCard from './PodcastCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SearchResultsProps {
  podcasts: Podcast[];
  loading?: boolean;
  error?: string;
  searchTerm?: string;
}

export default function SearchResults({ podcasts, loading, error, searchTerm }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Searching iTunes...</p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-3 w-2/3"></div>
                <div className="h-3 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded mb-1 w-1/2"></div>
                <div className="h-8 bg-gray-700 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 backdrop-blur-sm">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">Search Error</h3>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (podcasts.length === 0 && searchTerm) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-300 mb-4">
            No podcasts found for "{searchTerm}". Try a different search term.
          </p>
          <div className="text-sm text-gray-400">
            <p>Try searching for:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Podcast names (e.g., "The Daily")</li>
              <li>• Artist names (e.g., "Joe Rogan")</li>
              <li>• Topics (e.g., "Technology", "Comedy")</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Results header */}
      {searchTerm && podcasts.length > 0 && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Search Results
          </h2>
          <p className="text-gray-300">
            Found {podcasts.length} result{podcasts.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>

      {/* Show more results hint */}
      {podcasts.length >= 50 && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Showing first 50 results. Try a more specific search term for better results.
          </p>
        </div>
      )}
    </div>
  );
}

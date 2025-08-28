'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  onSearch: (term: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export default function SearchForm({ onSearch, loading = false, initialValue = '' }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for podcasts, artists, or topics..."
            className={cn(
              "w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none",
              "bg-white shadow-lg transition-all duration-200",
              "placeholder-gray-400",
              loading && "cursor-not-allowed opacity-50"
            )}
            disabled={loading}
          />
          
          <MagnifyingGlassIcon 
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6",
              loading ? "text-gray-400" : "text-gray-500"
            )} 
          />
          
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          className={cn(
            "mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold",
            "hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200",
            "transition-all duration-200 shadow-lg",
            "disabled:bg-gray-400 disabled:cursor-not-allowed"
          )}
        >
          {loading ? 'Searching...' : 'Search iTunes'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Search for podcasts, music, audiobooks and more from iTunes
      </div>
    </div>
  );
}

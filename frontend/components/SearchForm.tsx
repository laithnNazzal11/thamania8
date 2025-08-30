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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search through over 70 million podcasts and episodes..."
            className={cn(
              "w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-600",
              "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none",
              "bg-gray-800/50 backdrop-blur-sm text-white shadow-xl transition-all duration-200",
              "placeholder-gray-400",
              loading && "cursor-not-allowed opacity-50"
            )}
            disabled={loading}
          />
          
          <MagnifyingGlassIcon 
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6",
              loading ? "text-gray-500" : "text-gray-400"
            )} 
          />
          
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

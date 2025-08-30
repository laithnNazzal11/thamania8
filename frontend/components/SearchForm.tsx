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
              "w-full h-8 px-4 pl-10 text-sm rounded-2xl border border-gray-600",
              "focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF]/30 focus:outline-none",
              "bg-[#141523] text-white shadow-xl transition-all duration-200",
              "placeholder-gray-400",
              loading && "cursor-not-allowed opacity-50"
            )}
            disabled={loading}
          />
          
          <MagnifyingGlassIcon 
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
              loading ? "text-gray-500" : "text-gray-400"
            )} 
          />
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0A84FF] border-t-transparent"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

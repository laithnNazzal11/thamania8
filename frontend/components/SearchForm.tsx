'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  onSearch: (term: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export default function SearchForm({ onSearch, loading = false, initialValue = '' }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();
  const pathname = usePathname();

  // Update searchTerm when initialValue changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If we're not on the search page, navigate to it with the search term
      if (pathname !== '/search') {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        // If we're already on the search page, just perform the search
        onSearch(searchTerm.trim());
      }
    }
  };

  const handleInputFocus = () => {
    // Navigate to search page if we're not already there
    if (pathname !== '/search') {
      router.push('/search');
    }
  };

  const handleInputClick = () => {
    // Navigate to search page if we're not already there
    if (pathname !== '/search') {
      router.push('/search');
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
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            placeholder="Search through over 70 million podcasts and episodes..."
            className={cn(
              "w-full h-8 px-4 text-sm rounded-lg border border-gray-600 text-center",
              "focus:border-[#7b7bef] focus:outline-none focus:bg-[#1A1B2E] focus:placeholder-transparent",
              "bg-[#141523] text-white transition-all duration-200",
              "placeholder-gray-400 placeholder:text-center",
              loading && "cursor-not-allowed opacity-50"
            )}
            disabled={loading}
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

'use client';

import { useRef, useState, useEffect } from 'react';
import { Podcast } from '@/types';
// import PodcastCard from './PodcastCard'; // Unused in current implementation
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SearchResultsProps {
  podcasts: Podcast[];
  loading?: boolean;
  error?: string;
  searchTerm?: string;
}

export default function SearchResults({ podcasts, loading, error, searchTerm }: SearchResultsProps) {
  const podcastsScrollRef = useRef<HTMLDivElement>(null);
  const episodesScrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const episodesDropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEpisodesDropdown, setShowEpisodesDropdown] = useState(false);
  const [isGridLayout, setIsGridLayout] = useState(false);
  const [episodesLayout, setEpisodesLayout] = useState('horizontal'); // 'horizontal', 'grid', 'list', 'compact'


  const backgroundColors = [
    '#211b2b',  // Pink/Purple like first card
    '#2d2b36',  // Orange/Yellow like second card  
    '#22202c',  // Teal/Blue like third card
  ];
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (episodesDropdownRef.current && !episodesDropdownRef.current.contains(event.target as Node)) {
        setShowEpisodesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0A84FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Searching iTunes...</p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-[#141523] rounded-xl shadow-lg border border-gray-700 overflow-hidden animate-pulse">
              <div className="aspect-square bg-[#141523]"></div>
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-lg mx-auto">
          {/* Large search icon with purple theme */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Sad face overlay */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-[#141523]">
              <span className="text-gray-400 text-sm">😔</span>
            </div>
          </div>
          
          {/* Main heading */}
          <h3 className="text-2xl font-bold text-white mb-3">
            No results found
          </h3>
          
          {/* Search term display */}
          <p className="text-gray-300 mb-6 text-lg">
            No podcasts found for <span className="text-purple-400 font-semibold">&quot;{searchTerm}&quot;</span>
          </p>
          
          {/* Suggestions */}
          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
            <h4 className="text-white font-semibold mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 17H9.154a3.374 3.374 0 00-1.145-.553L7.46 15.9z" />
              </svg>
              Try searching for:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-purple-400 font-medium mb-2">Podcast Names</div>
                <div className="text-gray-400 space-y-1">
                  <div>&quot;The Daily&quot;</div>
                  <div>&quot;فنجان&quot;</div>
                </div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-purple-400 font-medium mb-2">Creator Names</div>
                <div className="text-gray-400 space-y-1">
                  <div>&quot;Joe Rogan&quot;</div>
                  <div>&quot;أحمد الشقيري&quot;</div>
                </div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-purple-400 font-medium mb-2">Topics</div>
                <div className="text-gray-400 space-y-1">
                  <div>&quot;Technology&quot;</div>
                  <div>&quot;Comedy&quot;</div>
                </div>
              </div>
            </div>
            
            {/* Quick action buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split podcasts into different categories for display
  const topPodcasts = podcasts.slice(0, 12); // First 12 as top podcasts
  const topEpisodes = podcasts.slice(12, 24); // Next 12 as top episodes

  return (
    <div className="w-full space-y-12">
      {/* Top Podcasts Section */}
      {topPodcasts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Top podcasts for {searchTerm}
          </h2>
            <div className="flex items-center space-x-4">
              {!isGridLayout && (
                <>
                  <button 
                    onClick={() => scrollLeft(podcastsScrollRef)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => scrollRight(podcastsScrollRef)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 rounded-lg shadow-lg z-10 group"
                    style={{
                      width: '200px',
                      height: '42.5px',
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, #633f80 0%, #454080 100%)'
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, #7b4fa3 0%, #5a4fa3 100%)'
                      }}
                    />
                    <button
                      onClick={() => {
                        setIsGridLayout(!isGridLayout);
                        setShowDropdown(false);
                      }}
                      className="relative w-full h-full text-left px-4 text-sm text-white transition-all duration-200 rounded-lg flex items-center z-10 cursor-pointer"
                    >
                      Switch layout to {isGridLayout ? 'Scroll' : 'Grid'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Podcast cards layout */}
          <div className="relative">
            {isGridLayout ? (
              /* Grid Layout */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {topPodcasts.map((podcast) => (
                  <div key={podcast.id} className="group cursor-pointer">
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
            ) : (
              /* Horizontal scrolling layout */
              <div 
                ref={podcastsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {topPodcasts.map((podcast) => (
                  <div key={podcast.id} className="flex-shrink-0 w-[200px]">
                    <div className="group cursor-pointer">
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
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {podcast.track_name}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {podcast.artist_name}
          </p>
        </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Episodes Section */}
      {topEpisodes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Top episodes for {searchTerm}
            </h2>
            <div className="flex items-center space-x-4">
              {episodesLayout === 'horizontal' && (
                <>
                  <button 
                    onClick={() => scrollLeft(episodesScrollRef)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => scrollRight(episodesScrollRef)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <div className="relative" ref={episodesDropdownRef}>
                <button 
                  onClick={() => setShowEpisodesDropdown(!showEpisodesDropdown)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Episodes Dropdown Menu */}
                {showEpisodesDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 rounded-lg shadow-lg z-10"
                    style={{
                      width: '200px',
                      background: 'linear-gradient(135deg, #633f80 0%, #454080 100%)'
                    }}
                  >
                    <div className="py-2">
                      {episodesLayout !== 'grid' && (
                        <button
                          onClick={() => {
                            setEpisodesLayout('grid');
                            setShowEpisodesDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/20 hover:brightness-110 transition-all duration-200 cursor-pointer"
                        >
                          Switch layout to Grid
                        </button>
                      )}
                      {episodesLayout !== 'list' && (
                        <button
                          onClick={() => {
                            setEpisodesLayout('list');
                            setShowEpisodesDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/20 hover:brightness-110 transition-all duration-200 cursor-pointer"
                        >
                          Switch layout to List
                        </button>
                      )}
                      {episodesLayout !== 'compact' && (
                        <button
                          onClick={() => {
                            setEpisodesLayout('compact');
                            setShowEpisodesDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/20 hover:brightness-110 transition-all duration-200 cursor-pointer"
                        >
                          Switch layout to Compact
                        </button>
                      )}
                      {episodesLayout !== 'horizontal' && (
                        <button
                          onClick={() => {
                            setEpisodesLayout('horizontal');
                            setShowEpisodesDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/20 hover:brightness-110 transition-all duration-200 cursor-pointer"
                        >
                          Switch layout to Scroll
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
                    {/* Episode cards layout */}
          <div className="relative">
                        {episodesLayout === 'grid' ? (
              /* Grid Layout - 3 items per row with same design as scroll */
              <div className="grid grid-cols-3 gap-6">
                {topEpisodes.map((podcast) => {
                  // Same background colors as horizontal scroll
                  const backgroundColors = [
                    '#211b2b',  // Pink/Purple like first card
                    '#2d2b36',  // Orange/Yellow like second card  
                    '#22202c',  // Teal/Blue like third card
                  ];
                  const bgColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
                  
                  return (
                  <div key={`episode-grid-${podcast.id}`} className="flex-shrink-0">
                    <div 
                      className="relative group cursor-pointer rounded-xl hover:brightness-125 hover:shadow-xl transition-all duration-300 shadow-lg overflow-hidden h-24"
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="flex space-x-4 p-4 h-full">
                        {/* Square image with play button overlay */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group/image">
                          {podcast.artwork_url_600 ? (
                            <img
                              src={podcast.artwork_url_600}
                              alt={podcast.track_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {podcast.track_name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Play Button Overlay - appears on image hover only */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                              <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {/* Content area */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                            {podcast.track_name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-1 truncate">
                            {podcast.artist_name}
                          </p>
                          <div className="flex items-center space-x-2 text-gray-500 text-xs">
                            <span>Jan 9</span>
                            <span>•</span>
                            <span>12min</span>
                          </div>
                        </div>
                      </div>
                      {/* 3 Dots Menu - Always Visible */}
                      <div className="absolute top-3 right-3">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : episodesLayout === 'list' ? (
              /* List Layout */
              <div className="space-y-6">
                {topEpisodes.map((podcast) => (
                  <div key={`episode-list-${podcast.id}`} className="flex items-start space-x-4 group cursor-pointer">
                    {/* Podcast Image with Hover Play Button */}
                    <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      {podcast.artwork_url_600 ? (
                        <img
                          src={podcast.artwork_url_600}
                          alt={podcast.track_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {podcast.track_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Play Button Overlay - appears on hover */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                          <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
                            {podcast.track_name}
                          </h3>
                          <p className="text-gray-300 text-base mb-2 truncate">
                            {podcast.artist_name}
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
                            في هذه الحلقة من #بودكاست_فنجان، ٢ سؤال عن تطوير استخدام الذكاء الاصطناعي في النزاعات السياسية وحتى استخدام مبدأ ويس الحب لا في قتل من يحبونهم في سلوك غريب بحالة محمد التميمي. الحلقة ١٠ من الموسم الثاني على StreamYard من تقديم Apple Podcast تقديم كما يوضح كيفية معرفة ترايك عن الخلافات بالخلافات أو قضيتك مع Phil...
                          </p>
                          <div className="text-gray-500 text-sm">
                            Feb 6, 2023 • 31min
                          </div>
                        </div>
                        
                        {/* 3 Dots Menu */}
                        <button className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : episodesLayout === 'compact' ? (
              /* Compact Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topEpisodes.map((podcast) => (
                  <div key={`episode-compact-${podcast.id}`} className="flex items-center space-x-3 p-3 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-colors cursor-pointer">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      {podcast.artwork_url_600 ? (
                        <img
                          src={podcast.artwork_url_600}
                          alt={podcast.track_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {podcast.track_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {podcast.track_name}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {podcast.artist_name} • Jan 9 • 12min
                      </p>
                    </div>
                  </div>
        ))}
      </div>
                        ) : (
              /* Horizontal scrolling layout */
              <div 
                ref={episodesScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {topEpisodes.map((podcast) => {
                                    // Different background colors for each card - using exact hex colors

                  const bgColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
                  
                  return (
                  <div key={`episode-horizontal-${podcast.id}`} className="flex-shrink-0 w-[320px]">
                    <div 
                      className="relative group cursor-pointer rounded-xl hover:brightness-125 hover:shadow-xl transition-all duration-300 shadow-lg overflow-hidden h-24"
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="flex space-x-4 p-4 h-full">
                        {/* Square image with play button overlay */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group/image">
                          {podcast.artwork_url_600 ? (
                            <img
                              src={podcast.artwork_url_600}
                              alt={podcast.track_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {podcast.track_name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Play Button Overlay - appears on image hover only */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                              <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {/* Content area */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                            {podcast.track_name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-1 truncate">
                            {podcast.artist_name}
                          </p>
                          <div className="flex items-center space-x-2 text-gray-500 text-xs">
                            <span>Jan 9</span>
                            <span>•</span>
                            <span>12min</span>
                          </div>
                        </div>
                      </div>
                      {/* 3 Dots Menu - Always Visible */}
                      <div className="absolute top-3 right-3">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

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

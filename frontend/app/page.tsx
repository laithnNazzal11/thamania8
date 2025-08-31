'use client';

import { useState, useEffect } from 'react';
import { Podcast } from '@/types';
import { apiService } from '@/lib/api';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';

export default function HomePage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  // Popular terms functionality not implemented in this version
  const [trendingPodcasts, setTrendingPodcasts] = useState<Podcast[]>([]);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setSearchTerm(term);
    setHasSearched(true);

    try {
      const response = await apiService.searchPodcasts(term);
      setPodcasts(response.results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search podcasts');
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load recent searches and popular terms - not implemented in free version
        // Using trending technology podcasts as default content

        // Load trending content by searching for "technology"
        const trendingResponse = await apiService.searchPodcasts('technology', 6);
        setTrendingPodcasts(trendingResponse.results);
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
        <div className="p-6 ">
           <svg width="45" height="49.46280991735537" viewBox="0 0 363 399" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 267.154V131.714C0.000987483 120.481 2.95865 109.446 8.57578 99.7176C14.1929 89.9894 22.2716 81.9111 32 76.2944L149.3 8.57437C159.029 2.9572 170.066 0 181.3 0C192.534 0 203.571 2.9572 213.3 8.57437L330.59 76.2944C340.318 81.9111 348.397 89.9894 354.014 99.7176C359.631 109.446 362.589 120.481 362.59 131.714V267.154C362.587 278.386 359.629 289.419 354.012 299.146C348.395 308.872 340.317 316.949 330.59 322.564L213.28 390.284C203.551 395.902 192.514 398.859 181.28 398.859C170.046 398.859 159.009 395.902 149.28 390.284L31.99 322.564C22.2649 316.947 14.1892 308.87 8.57394 299.144C2.95871 289.418 0.00172875 278.385 0 267.154V267.154Z" fill="url(#paint0_linear_0)"></path><path d="M212.45 368.604L317.45 307.994C321.01 305.931 324.342 303.498 327.39 300.734L213.28 234.914C203.55 229.299 192.514 226.343 181.28 226.344V350.604C181.279 354.252 182.239 357.836 184.063 360.996C185.886 364.155 188.509 366.779 191.668 368.603C194.827 370.428 198.411 371.388 202.059 371.388C205.707 371.389 209.291 370.428 212.45 368.604V368.604Z" fill="url(#paint1_linear_0)"></path><path d="M327.37 300.734C333.413 295.274 338.244 288.608 341.552 281.165C344.859 273.722 346.568 265.669 346.57 257.524V137.644C346.571 133.996 345.611 130.412 343.788 127.253C341.964 124.093 339.341 121.47 336.182 119.645C333.023 117.821 329.439 116.861 325.791 116.86C322.143 116.86 318.559 117.82 315.4 119.644L200.11 186.214C194.385 189.521 189.631 194.276 186.325 200.002C183.02 205.728 181.28 212.223 181.28 218.834V226.294C192.514 226.293 203.55 229.249 213.28 234.864L327.37 300.734Z" fill="url(#paint2_radial_0)"></path><defs><linearGradient id="paint0_linear_0" x1="264.38" y1="53.7644" x2="45.98" y2="436.614" gradientUnits="userSpaceOnUse"><stop offset="0.31" stopColor="#3ADEE6"></stop><stop offset="0.44" stop-color="#38D8E0"></stop><stop offset="0.61" stop-color="#33C6CE"></stop><stop offset="0.82" stop-color="#2BA9B0"></stop><stop offset="1" stop-color="#21888F"></stop></linearGradient><linearGradient id="paint1_linear_0" x1="288.51" y1="362.514" x2="46.98" y2="133.834" gradientUnits="userSpaceOnUse"><stop offset="0.15" stop-color="#9B7DD9"></stop><stop offset="0.37" stop-color="#7D63B3"></stop><stop offset="0.57" stop-color="#664F95"></stop><stop offset="0.75" stop-color="#584283"></stop><stop offset="0.88" stop-color="#533E7D"></stop></linearGradient><radialGradient id="paint2_radial_0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(91.39 51.4944) scale(480.67)"><stop offset="0.35" stop-color="#FF78C9"></stop><stop offset="0.42" stop-color="#FD7ECB"></stop><stop offset="0.51" stop-color="#F890D1"></stop><stop offset="0.62" stop-color="#EFAEDB"></stop><stop offset="0.66" stop-color="#EBBCE0"></stop></radialGradient></defs></svg>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
                          <a href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                <div className="w-6 h-6 flex items-center justify-center">
               <img src="https://podbay.fm/static/images/menu/home-line.svg" alt="Home" width="18" height="16"/>
                </div>
              <span className="font-medium">Home</span>
            </a>
            
                          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                <div className="w-6 h-6 flex items-center justify-center">
               <img src="https://podbay.fm/static/images/menu/discover-line.svg" alt="Discover" width="18" height="16"/>
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
                 <img src="https://podbay.fm/static/images/menu/my-queue-line.svg" alt="Queue" width="18" height="16"/>
                  </div>
                <span>My Queue</span>
              </a>
              
                              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                  <div className="w-6 h-6 flex items-center justify-center">
                 <img src="https://podbay.fm/static/images/menu/my-podcasts-line.svg" alt="Podcasts" width="18" height="16"/>
                  </div>
                <span>My Podcasts</span>
              </a>
              
                              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
                  <div className="w-6 h-6 flex items-center justify-center">
                 <img src="https://podbay.fm/static/images/menu/recents-line.svg" alt="Recents" width="18" height="16"/>
                  </div>
                <span>Recents</span>
              </a>
            </div>
          </div>
        </nav>

                {/* Footer */}
        <div className="p-4">
          <div className="text-left">
            <p className="text-xs" style={{color: '#777'}}>
              Podbay v2.9.6 by Fancy Soups.
            </p>
            <p className="text-xs mt-1" style={{color: '#777'}}>
              About • All Podcasts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button className="p-2">
                  <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2">
                  <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <button className="bg-[#375e83] hover:bg-[#3D6992] text-white px-4 h-8 rounded-lg text-sm font-medium transition-colors">
                  Log in
                </button>
                <button className="bg-[#375e83] hover:bg-[#3D6992] text-white px-4 h-8 rounded-lg text-sm font-medium transition-colors">
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
        <div className="flex-1 overflow-y-auto bg-gradient-to-l from-[#161627] to-[#161627]">
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
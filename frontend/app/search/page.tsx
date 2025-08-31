"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Podcast } from "@/types";
import { apiService } from "@/lib/api";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  // Get initial search term from URL params
  useEffect(() => {
    const q = searchParams.get("q");
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
    url.searchParams.set("q", encodeURIComponent(term));
    router.replace(url.pathname + url.search);

    try {
      const response = await apiService.searchPodcasts(term);
      setPodcasts(response.results);
    } catch (err: any) {
      setError(err.message || "Failed to search podcasts");
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
        <div className=" px-5 py-6">
          <svg
            width="45"
            height="49.46280991735537"
            viewBox="0 0 363 399"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 267.154V131.714C0.000987483 120.481 2.95865 109.446 8.57578 99.7176C14.1929 89.9894 22.2716 81.9111 32 76.2944L149.3 8.57437C159.029 2.9572 170.066 0 181.3 0C192.534 0 203.571 2.9572 213.3 8.57437L330.59 76.2944C340.318 81.9111 348.397 89.9894 354.014 99.7176C359.631 109.446 362.589 120.481 362.59 131.714V267.154C362.587 278.386 359.629 289.419 354.012 299.146C348.395 308.872 340.317 316.949 330.59 322.564L213.28 390.284C203.551 395.902 192.514 398.859 181.28 398.859C170.046 398.859 159.009 395.902 149.28 390.284L31.99 322.564C22.2649 316.947 14.1892 308.87 8.57394 299.144C2.95871 289.418 0.00172875 278.385 0 267.154V267.154Z"
              fill="url(#paint0_linear_0)"
            ></path>
            <path
              d="M212.45 368.604L317.45 307.994C321.01 305.931 324.342 303.498 327.39 300.734L213.28 234.914C203.55 229.299 192.514 226.343 181.28 226.344V350.604C181.279 354.252 182.239 357.836 184.063 360.996C185.886 364.155 188.509 366.779 191.668 368.603C194.827 370.428 198.411 371.388 202.059 371.388C205.707 371.389 209.291 370.428 212.45 368.604V368.604Z"
              fill="url(#paint1_linear_0)"
            ></path>
            <path
              d="M327.37 300.734C333.413 295.274 338.244 288.608 341.552 281.165C344.859 273.722 346.568 265.669 346.57 257.524V137.644C346.571 133.996 345.611 130.412 343.788 127.253C341.964 124.093 339.341 121.47 336.182 119.645C333.023 117.821 329.439 116.861 325.791 116.86C322.143 116.86 318.559 117.82 315.4 119.644L200.11 186.214C194.385 189.521 189.631 194.276 186.325 200.002C183.02 205.728 181.28 212.223 181.28 218.834V226.294C192.514 226.293 203.55 229.249 213.28 234.864L327.37 300.734Z"
              fill="url(#paint2_radial_0)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_0"
                x1="264.38"
                y1="53.7644"
                x2="45.98"
                y2="436.614"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.31" stopColor="#3ADEE6"></stop>
                <stop offset="0.44" stopColor="#38D8E0"></stop>
                <stop offset="0.61" stopColor="#33C6CE"></stop>
                <stop offset="0.82" stopColor="#2BA9B0"></stop>
                <stop offset="1" stopColor="#21888F"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_0"
                x1="288.51"
                y1="362.514"
                x2="46.98"
                y2="133.834"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.15" stopColor="#9B7DD9"></stop>
                <stop offset="0.37" stopColor="#7D63B3"></stop>
                <stop offset="0.57" stopColor="#664F95"></stop>
                <stop offset="0.75" stopColor="#584283"></stop>
                <stop offset="0.88" stopColor="#533E7D"></stop>
              </linearGradient>
              <radialGradient
                id="paint2_radial_0"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(91.39 51.4944) scale(480.67)"
              >
                <stop offset="0.35" stopColor="#FF78C9"></stop>
                <stop offset="0.42" stopColor="#FD7ECB"></stop>
                <stop offset="0.51" stopColor="#F890D1"></stop>
                <stop offset="0.62" stopColor="#EFAEDB"></stop>
                <stop offset="0.66" stopColor="#EBBCE0"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
                         <a
               href="/"
               className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 nav-item-hover"
             >
               <div className="w-6 h-6 flex items-center justify-center relative z-10">
                 <img
                   src="https://podbay.fm/static/images/menu/home-line.svg"
                   alt="Home"
                   width="18"
                   height="16"
                 />
               </div>
               <span className="font-medium text-sm relative z-10">Home</span>
             </a>
 
             <a
               href="#"
               className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 nav-item-hover"
             >
               <div className="w-6 h-6 flex items-center justify-center relative z-10">
                 <img
                   src="https://podbay.fm/static/images/menu/discover-line.svg"
                   alt="Discover"
                   width="16"
                   height="14"
                 />
               </div>
               <span className="text-sm relative z-10">Discover</span>
             </a>
          </div>

          {/* Your Stuff Section */}
          <div className="pt-1">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 px-1 text-left">
              YOUR STUFF
            </h3>
                         <div className="space-y-1">
               <a
                 href="#"
                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 nav-item-hover"
               >
                 <div className="w-6 h-6 flex items-center justify-center relative z-10">
                   <img
                     src="https://podbay.fm/static/images/menu/my-queue-line.svg"
                     alt="Queue"
                     width="18"
                     height="16"
                   />
                 </div>
                 <span className="text-sm relative z-10">My Queue</span>
               </a>
 
               <a
                 href="#"
                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 nav-item-hover"
               >
                 <div className="w-6 h-6 flex items-center justify-center relative z-10">
                   <img
                     src="https://podbay.fm/static/images/menu/my-podcasts-line.svg"
                     alt="Podcasts"
                     width="18"
                     height="16"
                   />
                 </div>
                 <span className="text-sm relative z-10">My Podcasts</span>
               </a>
 
               <a
                 href="#"
                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 nav-item-hover"
               >
                 <div className="w-6 h-6 flex items-center justify-center relative z-10">
                   <img
                     src="https://podbay.fm/static/images/menu/recents-line.svg"
                     alt="Recents"
                     width="18"
                     height="16"
                   />
                 </div>
                 <span className="text-sm relative z-10">Recents</span>
               </a>
             </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="text-left">
            <p className="text-xs" style={{ color: "#777" }}>
              Podbay v2.9.6 by Fancy Soups.
            </p>
            <p className="text-xs mt-1" style={{ color: "#777" }}>
              About • All Podcasts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={() => router.back()} className="p-2">
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button onClick={() => router.forward()} className="p-2">
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Centered Search Bar */}
              <div className="flex-1 mx-2">
                <SearchForm
                  onSearch={handleSearch}
                  loading={loading}
                  initialValue={searchTerm}
                />
              </div>

              <div className="flex items-center space-x-1">
                <button className="bg-[#375e83] hover:bg-[#3D6992]  w-16   text-white  h-8 rounded-sm text-sm font-medium transition-colors">
                  Log in
                </button>
                <button className="bg-[#375e83] hover:bg-[#3D6992]  w-16   text-white  h-8 rounded-sm text-sm font-medium transition-colors">
                  Sign up
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-l from-[#161627] to-[#161627]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {hasSearched ? (
              <div>
                {/* Search Header */}
                {/* <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {searchTerm
                      ? `Search results for "${searchTerm}"`
                      : "Search Results"}
                  </h1>
                  {podcasts.length > 0 && (
                    <p className="text-gray-400">
                      Found {podcasts.length} podcast
                      {podcasts.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div> */}

                {/* Search Results */}
                <SearchResults
                  podcasts={podcasts}
                  loading={loading}
                  error={error || ""}
                  searchTerm={searchTerm}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[100px]">
                <div className="text-center">
                  <h1 className="text-md text-white font-normal opacity-70">
                    Type in a search term to start.
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

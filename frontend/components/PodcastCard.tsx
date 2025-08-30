'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon, CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';
import { Podcast } from '@/types';
import { cn, formatDate, truncateText, getArtworkUrl } from '@/lib/utils';

interface PodcastCardProps {
  podcast: Podcast;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleViewInItunes = () => {
    if (podcast.track_view_url) {
      window.open(podcast.track_view_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-[#141523] rounded-xl shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden group">
      {/* Artwork */}
      <div className="relative aspect-square bg-[#141523]">
        {!imageError && podcast.artwork_url_600 ? (
          <Image
            src={podcast.artwork_url_600}
            alt={podcast.track_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">
                  {podcast.track_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300">No Image</p>
            </div>
          </div>
        )}
        
        {/* Overlay with iTunes link */}
        {podcast.track_view_url && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleViewInItunes}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg hover:shadow-xl"
            >
              <ArrowTopRightOnSquareIcon className="h-6 w-6 text-blue-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">
          {podcast.track_name}
        </h3>

        {/* Artist */}
        <div className="flex items-center text-gray-300 mb-3">
          <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{podcast.artist_name}</span>
        </div>

        {/* Description */}
        {podcast.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {truncateText(podcast.description, 150)}
          </p>
        )}

        {/* Meta Information */}
        <div className="space-y-2">
          {/* Genre */}
          {podcast.primary_genre_name && (
            <div className="flex items-center text-gray-400 text-xs">
              <TagIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{podcast.primary_genre_name}</span>
            </div>
          )}

          {/* Release Date */}
          {podcast.release_date && (
            <div className="flex items-center text-gray-400 text-xs">
              <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>{formatDate(podcast.release_date)}</span>
            </div>
          )}

          {/* Track Count */}
          {podcast.track_count && (
            <div className="text-gray-400 text-xs">
              {podcast.track_count} episodes
            </div>
          )}
        </div>

        {/* Action Button */}
        {podcast.track_view_url && (
          <button
            onClick={handleViewInItunes}
            className={cn(
              "mt-4 w-full bg-[#0A84FF] text-white py-2 px-4 rounded-lg text-sm font-medium",
              "hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50",
              "transition-all duration-200 shadow-lg hover:shadow-xl"
            )}
          >
            View in iTunes
          </button>
        )}
      </div>
    </div>
  );
}

/* Add to globals.css for line-clamp support */
// .line-clamp-2 {
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }

// .line-clamp-3 {
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }

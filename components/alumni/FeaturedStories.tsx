'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SuccessStory {
  id: string;
  title: string;
  content: string;
  alumniName: string;
  profileImage: string | null;
  storyType: string;
  sport: string;
  images: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date;
}

export default function FeaturedStories() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/alumni/stories?featured=true&limit=3');
      const data = await response.json();
      setStories(data.stories || []);
    } catch {
      // Error fetching stories
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-700"></div>
            <div className="p-6">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
        <p className="text-slate-400">No featured stories yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Link
          key={story.id}
          href={`/alumni/stories/${story.id}`}
          className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all group"
        >
          {/* Story Image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
            {story.images && story.images.length > 0 ? (
              <Image
                src={story.images[0]}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            
            {/* Sport Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                {story.sport}
              </span>
            </div>

            {/* Story Type Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                {story.storyType}
              </span>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-6">
            {/* Alumni Info */}
            <div className="flex items-center gap-3 mb-3">
              {story.profileImage ? (
                <Image
                  src={story.profileImage}
                  alt={story.alumniName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {story.alumniName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{story.alumniName}</p>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
              {story.title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
              {truncateContent(story.content, 120)}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{story.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{story.likeCount}</span>
              </div>
            </div>

            {/* Read More Link */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                Read Full Story →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

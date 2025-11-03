'use client';

import { useState } from 'react';
import { X, Instagram, Facebook, Twitter, Download, Eye, Calendar, Hash, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentPreviewProps {
  content: {
    platform: string;
    caption?: string;
    hashtags?: string[];
    media?: string[];
    scheduledFor?: string;
    engagement?: {
      estimatedReach?: number;
      estimatedEngagement?: number;
    };
  };
  onClose: () => void;
  onPublish?: () => void;
  onSchedule?: (date: Date) => void;
  onEdit?: () => void;
}

export default function ContentPreview({
  content,
  onClose,
  onPublish,
  onSchedule,
  onEdit,
}: ContentPreviewProps) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      case 'twitter':
      case 'x':
        return Twitter;
      default:
        return ImageIcon;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600';
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
      case 'x':
        return 'bg-black';
      default:
        return 'bg-gray-600';
    }
  };

  const PlatformIcon = getPlatformIcon(content.platform);

  const handleSchedule = () => {
    if (scheduledDate && onSchedule) {
      onSchedule(new Date(scheduledDate));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getPlatformColor(content.platform)}`}>
              <PlatformIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Preview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{content.platform} Post</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Visual Preview</h3>
              
              {/* Platform-specific preview */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {content.media && content.media.length > 0 ? (
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={content.media[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {content.media.length > 1 && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        +{content.media.length - 1} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">No media attached</p>
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div className="p-4 bg-white dark:bg-slate-900">
                  <p className="text-slate-900 dark:text-white text-sm mb-3">
                    {content.caption || 'No caption provided'}
                  </p>
                  
                  {/* Hashtags */}
                  {content.hashtags && content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-blue-600 dark:text-blue-400 text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Post Details</h3>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {/* Platform */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Platform</span>
                      <Badge variant="outline" className="capitalize">{content.platform}</Badge>
                    </div>

                    {/* Caption Length */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Caption Length</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {content.caption?.length || 0} characters
                      </span>
                    </div>

                    {/* Hashtags Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Hashtags
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {content.hashtags?.length || 0}
                      </span>
                    </div>

                    {/* Media Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Media Files
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {content.media?.length || 0}
                      </span>
                    </div>

                    {/* Scheduled Time */}
                    {content.scheduledFor && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Scheduled For
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {new Date(content.scheduledFor).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Estimates */}
              {content.engagement && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Estimated Performance
                  </h3>
                  
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      {content.engagement.estimatedReach && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Estimated Reach
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {content.engagement.estimatedReach.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {content.engagement.estimatedEngagement && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Estimated Engagement
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {content.engagement.estimatedEngagement.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: '60%' }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Scheduler */}
              {showScheduler && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Schedule Post
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            {onPublish && (
              <Button
                onClick={onPublish}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
            )}

            {onSchedule && !showScheduler && (
              <Button
                onClick={() => setShowScheduler(true)}
                variant="outline"
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            )}

            {showScheduler && onSchedule && (
              <Button
                onClick={handleSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!scheduledDate}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Confirm Schedule
              </Button>
            )}

            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>
            )}

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

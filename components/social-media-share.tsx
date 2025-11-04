'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Twitter, Video, Share2, Copy, CheckCircle2 } from 'lucide-react';

interface SocialMediaShareProps {
  /**
   * URL to share - defaults to current page
   */
  url?: string;
  /**
   * Title/text to share
   */
  title?: string;
  /**
   * Description for the share
   */
  description?: string;
  /**
   * Hashtags to include (without #)
   */
  hashtags?: string[];
  /**
   * Compact mode (smaller buttons)
   */
  compact?: boolean;
}

export function SocialMediaShare({
  url,
  title = 'Go4it Sports Academy - Train Here. Place Anywhere.',
  description = 'Online + hybrid school for elite student-athletes with NCAA Pathway support and GAR™ verification',
  hashtags = ['Go4it', 'NCAA', 'StudentAthlete', 'GAR'],
  compact = false,
}: SocialMediaShareProps) {
  const [copied, setCopied] = useState(false);
  
  // Get current page URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.join(',');

  // Social media share URLs
  const shareLinks = {
    instagram: `https://www.instagram.com/`, // Instagram doesn't support URL sharing, open profile
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    tiktok: `https://www.tiktok.com/`, // TikTok doesn't support URL sharing, open profile
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      const shareText = `${title}\n\n${description}\n\n${shareUrl}\n\n#${hashtags.join(' #')}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Failed to copy to clipboard
      setCopied(false);
    }
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer,width=600,height=600');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-2">Share:</span>
        <button
          onClick={() => handleShare('facebook')}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          👤
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="text-sky-600 hover:text-sky-800 transition-colors"
          aria-label="Share on Twitter"
          title="Share on Twitter"
        >
          🐦
        </button>
        <button
          onClick={() => handleShare('instagram')}
          className="text-pink-600 hover:text-pink-800 transition-colors"
          aria-label="Open Instagram"
          title="Share on Instagram"
        >
          📷
        </button>
        <button
          onClick={() => handleShare('tiktok')}
          className="text-gray-900 hover:text-gray-700 transition-colors"
          aria-label="Open TikTok"
          title="Share on TikTok"
        >
          🎵
        </button>
        <button
          onClick={copyToClipboard}
          className="text-gray-600 hover:text-gray-800 transition-colors ml-2"
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share on Social Media
        </CardTitle>
        <CardDescription>
          Deploy this content to your social media channels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleShare('facebook')}
            variant="outline"
            className="w-full justify-start gap-3 border-blue-200 hover:bg-blue-50"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Facebook</span>
          </Button>

          <Button
            onClick={() => handleShare('twitter')}
            variant="outline"
            className="w-full justify-start gap-3 border-sky-200 hover:bg-sky-50"
          >
            <Twitter className="w-5 h-5 text-sky-600" />
            <span>Twitter/X</span>
          </Button>

          <Button
            onClick={() => handleShare('instagram')}
            variant="outline"
            className="w-full justify-start gap-3 border-pink-200 hover:bg-pink-50"
          >
            <Instagram className="w-5 h-5 text-pink-600" />
            <span>Instagram</span>
            <Badge variant="outline" className="ml-auto text-xs">Profile</Badge>
          </Button>

          <Button
            onClick={() => handleShare('tiktok')}
            variant="outline"
            className="w-full justify-start gap-3 border-gray-200 hover:bg-gray-50"
          >
            <Video className="w-5 h-5 text-gray-900" />
            <span>TikTok</span>
            <Badge variant="outline" className="ml-auto text-xs">Profile</Badge>
          </Button>
        </div>

        {/* Copy Link */}
        <div className="pt-4 border-t">
          <Button
            onClick={copyToClipboard}
            variant="secondary"
            className="w-full justify-start gap-3"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Link with Text</span>
              </>
            )}
          </Button>
        </div>

        {/* Hashtags Preview */}
        <div className="pt-2 text-sm text-gray-600">
          <p className="font-medium mb-1">Suggested Hashtags:</p>
          <p className="text-gray-500">#{hashtags.join(' #')}</p>
        </div>

        {/* Advanced Link */}
        <div className="pt-2 text-center">
          <a
            href="/automation/social-media"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Need AI-powered content? Visit Social Media Automation →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Usage Examples:
 * 
 * // Default (current page)
 * <SocialMediaShare />
 * 
 * // Custom content
 * <SocialMediaShare 
 *   url="https://go4itsports.org/events"
 *   title="Join our next GAR Testing Event"
 *   hashtags={['GAR', 'Testing', 'Basketball']}
 * />
 * 
 * // Compact mode for inline sharing
 * <SocialMediaShare compact />
 */

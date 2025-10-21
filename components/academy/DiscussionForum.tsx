'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  Pin,
  User,
  Clock,
  Eye,
  MessageCircle,
  Filter,
} from 'lucide-react';

interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement';
  isPinned: boolean;
  isAnonymous: boolean;
  authorName: string;
  authorInitials: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  hasLiked: boolean;
}

interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  authorName: string;
  authorInitials: string;
  createdAt: string;
  likeCount: number;
  hasLiked: boolean;
  replies?: Comment[];
}

export default function DiscussionForum({ courseId, studentId }: { courseId: string; studentId: string }) {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'discussion' | 'question' | 'announcement'>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion' as const,
    isAnonymous: false,
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPosts();
  }, [courseId, filter]);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ courseId, filter });
      const response = await fetch(`/api/academy/collaboration/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/academy/collaboration/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await fetch('/api/academy/collaboration/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          courseId,
          studentId,
        }),
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', type: 'discussion', isAnonymous: false });
        setShowCreateDialog(false);
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/academy/collaboration/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          studentId,
          isAnonymous: false,
        }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments(postId);
        // Update comment count in posts list
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleLike = async (postId: string, isComment = false, commentId?: string) => {
    try {
      const endpoint = isComment
        ? `/api/academy/collaboration/comments/${commentId}/like`
        : `/api/academy/collaboration/posts/${postId}/like`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        if (isComment) {
          setComments(prev => prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  hasLiked: !comment.hasLiked,
                  likeCount: comment.hasLiked ? comment.likeCount - 1 : comment.likeCount + 1
                }
              : comment
          ));
        } else {
          setPosts(prev => prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  hasLiked: !post.hasLiked,
                  likeCount: post.hasLiked ? post.likeCount - 1 : post.likeCount + 1
                }
              : post
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-600';
      case 'announcement': return 'bg-purple-600';
      default: return 'bg-green-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const pinnedPosts = posts.filter(post => post.isPinned);
  const regularPosts = posts.filter(post => !post.isPinned);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Discussion Forum</h1>
          <p className="text-slate-400">Connect with your classmates and instructors</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Post Type</label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="discussion">Discussion</option>
                  <option value="question">Question</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content..."
                  rows={6}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="text-blue-600"
                />
                <label htmlFor="anonymous" className="text-sm text-slate-300">
                  Post anonymously
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={createPost} className="bg-blue-600 hover:bg-blue-700">
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="flex gap-2">
          {(['all', 'discussion', 'question', 'announcement'] as const).map(type => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className={filter === type ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
            >
              {type === 'all' ? 'All Posts' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading posts...</p>
          </div>
        ) : (
          <>
            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Pin className="w-5 h-5 text-yellow-400" />
                  Pinned Posts
                </h2>
                {pinnedPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                    onLike={() => toggleLike(post.id)}
                  />
                ))}
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-2">
              {regularPosts.length > 0 ? (
                regularPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                    onLike={() => toggleLike(post.id)}
                  />
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No posts found. Be the first to start a discussion!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(selectedPost.type)}>
                  {selectedPost.type}
                </Badge>
                {selectedPost.isPinned && (
                  <Badge className="bg-yellow-600">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-white text-xl">{selectedPost.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-slate-600 text-xs">
                      {selectedPost.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedPost.isAnonymous ? 'Anonymous' : selectedPost.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(selectedPost.createdAt)}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Post Content */}
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleLike(selectedPost.id)}
                  className={`text-slate-400 hover:text-blue-400 ${selectedPost.hasLiked ? 'text-blue-400' : ''}`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {selectedPost.likeCount}
                </Button>
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-4 h-4" />
                  {selectedPost.commentCount} comments
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Comments</h3>

                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                  <Button
                    onClick={() => addComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-l-2 border-slate-600 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-slate-600 text-xs">
                            {comment.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">
                          {comment.isAnonymous ? 'Anonymous' : comment.authorName}
                        </span>
                        <span className="text-slate-400 text-sm">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-slate-300 mb-2">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(selectedPost.id, true, comment.id)}
                        className={`text-slate-400 hover:text-blue-400 ${comment.hasLiked ? 'text-blue-400' : ''}`}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {comment.likeCount}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function PostCard({ post, onClick, onLike }: {
  post: DiscussionPost;
  onClick: () => void;
  onLike: () => void;
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-600';
      case 'announcement': return 'bg-purple-600';
      default: return 'bg-green-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer transition-colors" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={getTypeColor(post.type)}>
              {post.type}
            </Badge>
            {post.isPinned && (
              <Badge className="bg-yellow-600">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.commentCount}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {post.likeCount}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-slate-600 text-xs">
                {post.authorInitials}
              </AvatarFallback>
            </Avatar>
            <span>{post.isAnonymous ? 'Anonymous' : post.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className={`text-slate-400 hover:text-blue-400 ${post.hasLiked ? 'text-blue-400' : ''}`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {post.likeCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.commentCount}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { apiRequest } from '@/lib/queryClient';

interface MessageData {
  content: string;
  recipientId: number;
}

interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface CreatePostData {
  content: string;
  mediaUrl?: string;
}

/**
 * Service for handling social interactions
 * This creates a reusable API layer that can be easily integrated with CMS
 */
export const socialService = {
  /**
   * Get connection suggestions based on sports, location, and interests
   */
  async getConnectionSuggestions(limit: number = 10, sportFilter?: string) {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (sportFilter) queryParams.append('sport', sportFilter);
    
    return apiRequest('GET', `/api/social/suggestions?${queryParams.toString()}`);
  },
  
  /**
   * Send a direct message to another athlete
   */
  async sendMessage(messageData: MessageData) {
    return apiRequest('POST', '/api/social/messages', messageData);
  },
  
  /**
   * Get all messages with a specific user
   */
  async getMessageThread(userId: number) {
    return apiRequest('GET', `/api/social/messages/${userId}`);
  },
  
  /**
   * Get latest social feed posts
   */
  async getFeedPosts(page: number = 1, limit: number = 10) {
    return apiRequest('GET', `/api/social/feed?page=${page}&limit=${limit}`);
  },
  
  /**
   * Create a new post
   */
  async createPost(postData: CreatePostData) {
    return apiRequest('POST', '/api/social/posts', postData);
  },
  
  /**
   * Like a post
   */
  async likePost(postId: number) {
    return apiRequest('POST', `/api/social/posts/${postId}/like`);
  },
  
  /**
   * Unlike a post
   */
  async unlikePost(postId: number) {
    return apiRequest('DELETE', `/api/social/posts/${postId}/like`);
  },
  
  /**
   * Get comments for a post
   */
  async getPostComments(postId: number) {
    return apiRequest('GET', `/api/social/posts/${postId}/comments`);
  },
  
  /**
   * Add a comment to a post
   */
  async addComment(postId: number, content: string) {
    return apiRequest('POST', `/api/social/posts/${postId}/comments`, { content });
  },
  
  /**
   * Get upcoming events
   */
  async getUpcomingEvents() {
    return apiRequest('/api/social/events');
  },
  
  /**
   * RSVP to an event
   */
  async respondToEvent(eventId: number, status: 'going' | 'maybe' | 'not-going') {
    return apiRequest(`/api/social/events/${eventId}/rsvp`, {
      method: 'POST',
      body: { status },
    });
  },
};
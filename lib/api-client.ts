/**
 * Full-Stack API Client
 * Connects all frontend features to backend endpoints
 */

const API_BASE = '';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', response.token);
    }
    
    return response;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    sport?: string;
    position?: string;
    graduationYear?: number;
  }) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', response.token);
    }
    
    return response;
  }

  async me() {
    return this.request<{ user: any }>('/api/auth/me');
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
  }

  // Dashboard
  async getDashboard() {
    return this.request<{
      user: any;
      stats: {
        totalAthletes: number;
        totalAnalyses: number;
        averageGAR: number;
        recentAnalyses: any[];
      };
      recentAnalyses: any[];
    }>('/api/dashboard');
  }

  // Video Analysis
  async createVideoAnalysis(data: {
    fileName: string;
    filePath: string;
    sport: string;
    garScore?: number;
    analysisData?: any;
    feedback?: string;
  }) {
    return this.request<any>('/api/video-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVideoAnalyses() {
    return this.request<any[]>('/api/video-analysis');
  }

  // Rankings
  async getAthleteRankings(sport?: string, limit: number = 100) {
    const params = new URLSearchParams();
    if (sport) params.append('sport', sport);
    params.append('limit', limit.toString());
    
    return this.request<any[]>(`/api/rankings?${params}`);
  }

  // Verified Athletes
  async getVerifiedAthletes(sport?: string, minGAR: number = 80) {
    const params = new URLSearchParams();
    if (sport) params.append('sport', sport);
    params.append('minGAR', minGAR.toString());
    
    return this.request<any[]>(`/api/verified-athletes?${params}`);
  }

  // Admin
  async getAdminStats() {
    return this.request<{
      totalAthletes: number;
      totalAnalyses: number;
      averageGAR: number;
      recentAnalyses: any[];
    }>('/api/admin/stats');
  }

  // Subscription
  async updateSubscription(data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    subscriptionEndDate?: Date;
  }) {
    return this.request<{ user: any }>('/api/subscription', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // File Upload
  async uploadFile(file: File, sport: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sport', sport);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // GAR Analysis
  async analyzeVideo(videoId: string, sport: string) {
    return this.request<{
      garScore: number;
      analysis: any;
      feedback: string;
    }>('/api/gar-analysis', {
      method: 'POST',
      body: JSON.stringify({ videoId, sport }),
    });
  }

  // StarPath Integration
  async getStarPathProgress() {
    return this.request<{
      level: number;
      xp: number;
      skills: any[];
      achievements: any[];
    }>('/api/starpath/progress');
  }

  async completeSkill(skillId: string) {
    return this.request<{ xpGained: number; newLevel?: number }>('/api/starpath/complete-skill', {
      method: 'POST',
      body: JSON.stringify({ skillId }),
    });
  }

  // AI Coach
  async getAICoachRecommendations(sport: string, currentLevel: number) {
    return this.request<{
      drills: any[];
      training: any[];
      feedback: string;
    }>('/api/ai-coach/recommendations', {
      method: 'POST',
      body: JSON.stringify({ sport, currentLevel }),
    });
  }

  // Academy
  async getAcademyCourses() {
    return this.request<any[]>('/api/academy/courses');
  }

  async enrollInCourse(courseId: string) {
    return this.request<any>('/api/academy/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  // NCAA Eligibility
  async checkNCAEligibility(data: {
    gpa: number;
    satScore?: number;
    actScore?: number;
    coreCoursesCompleted: number;
  }) {
    return this.request<{
      eligible: boolean;
      division: string;
      requirements: any;
    }>('/api/ncaa/eligibility-check', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Recruiting
  async getCollegeRecommendations(sport: string, academicLevel: string, location?: string) {
    const params = new URLSearchParams();
    params.append('sport', sport);
    params.append('academicLevel', academicLevel);
    if (location) params.append('location', location);
    
    return this.request<any[]>(`/api/recruiting/recommendations?${params}`);
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/api/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request<any>(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
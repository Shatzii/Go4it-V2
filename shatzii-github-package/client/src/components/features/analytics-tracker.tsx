import { useEffect } from "react";
import { useLocation } from "wouter";

interface AnalyticsEvent {
  type: 'page_view' | 'click' | 'form_submit' | 'demo_request' | 'signup' | 'login';
  page?: string;
  element?: string;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadUserId(): void {
    const stored = localStorage.getItem('analytics_user_id');
    if (stored) {
      this.userId = stored;
    } else {
      this.userId = this.generateSessionId();
      localStorage.setItem('analytics_user_id', this.userId);
    }
  }

  track(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.events.push(enrichedEvent);
    this.sendToServer(enrichedEvent);
  }

  private async sendToServer(event: any): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
  }
}

const analytics = new AnalyticsService();

export default function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    analytics.track({
      type: 'page_view',
      page: location,
      metadata: {
        timestamp: Date.now(),
        loadTime: performance.now()
      }
    });
  }, [location]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementInfo = {
        tagName: target.tagName,
        className: target.className,
        textContent: target.textContent?.slice(0, 100),
        href: target.getAttribute('href'),
        id: target.id
      };

      analytics.track({
        type: 'click',
        element: `${target.tagName}${target.id ? '#' + target.id : ''}${target.className ? '.' + target.className.split(' ')[0] : ''}`,
        metadata: elementInfo
      });
    };

    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      analytics.track({
        type: 'form_submit',
        element: form.id || form.className || 'unknown_form',
        metadata: {
          action: form.action,
          method: form.method
        }
      });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return null;
}

export { analytics };
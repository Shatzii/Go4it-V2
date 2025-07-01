import path from 'path';
import os from 'os';

// AI service for Rhythm code generation
// This is a simulated implementation for demonstration purposes

export interface AiGenerationRequest {
  prompt: string;
  model: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiGenerationResult {
  content: string;
  success: boolean;
  message?: string;
}

class AIService {
  private isInitialized: boolean;
  private currentModel: string;
  private memoryUsage: { used: number; total: number };
  
  constructor() {
    this.isInitialized = false;
    this.currentModel = 'rhythm-core-v0.1.0';
    this.memoryUsage = { used: 0, total: 0 };
    
    // Initialize AI service
    this.initialize();
  }
  
  private async initialize() {
    // Simulate loading a model
    console.log('Initializing AI service...');
    
    // Wait 2 seconds to simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get system memory info
    const totalMemory = Math.floor(os.totalmem() / (1024 * 1024)); // Convert to MB
    const freeMemory = Math.floor(os.freemem() / (1024 * 1024)); // Convert to MB
    const usedMemory = totalMemory - freeMemory;
    
    // Set as initialized
    this.isInitialized = true;
    this.memoryUsage = {
      used: 1200, // Mock 1.2GB used for demo
      total: 1500  // Mock 1.5GB allocated for demo
    };
    
    console.log('AI service initialized');
  }
  
  async getStatus(): Promise<{
    isReady: boolean;
    model: string;
    memoryUsage: { used: number; total: number };
    message?: string;
  }> {
    // Use fixed values for demo purposes
    this.memoryUsage = {
      used: 1200, // Mock 1.2GB used
      total: 1500  // Mock 1.5GB allocated
    };
    
    return {
      isReady: this.isInitialized,
      model: this.currentModel,
      memoryUsage: this.memoryUsage,
      message: this.isInitialized ? undefined : 'AI service is initializing'
    };
  }
  
  async generateCode(request: AiGenerationRequest): Promise<AiGenerationResult> {
    if (!this.isInitialized) {
      return {
        content: '',
        success: false,
        message: 'AI service is not initialized yet'
      };
    }
    
    // Log the request
    console.log('AI generation request:', request);
    
    // Simulate processing time based on prompt length
    const processingTime = Math.min(2000, request.prompt.length * 5);
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    try {
      // Simple generation logic based on the prompt
      const prompt = request.prompt.toLowerCase();
      
      // Detect intent from the prompt
      if (prompt.includes('landing page') || prompt.includes('homepage')) {
        return {
          content: this.generateLandingPage(request.prompt),
          success: true
        };
      } else if (prompt.includes('blog') || prompt.includes('article')) {
        return {
          content: this.generateBlogTemplate(request.prompt),
          success: true
        };
      } else if (prompt.includes('dashboard') || prompt.includes('admin')) {
        return {
          content: this.generateDashboardTemplate(request.prompt),
          success: true
        };
      } else if (prompt.includes('form') || prompt.includes('contact')) {
        return {
          content: this.generateFormTemplate(request.prompt),
          success: true
        };
      } else if (prompt.includes('explain')) {
        // Generate an explanation of the provided code
        return {
          content: this.generateExplanation(request.context || ''),
          success: true
        };
      } else if (prompt.includes('create') || prompt.includes('generate')) {
        // Generate a simple Rhythm file based on the prompt
        const fileType = this.extractFileType(request.prompt);
        const content = this.generateRhythmTemplate(fileType, request.prompt);
        
        return {
          content,
          success: true
        };
      } else {
        // Generate a generic response
        return {
          content: `// Generated code based on: ${request.prompt}\n\n@extends("layout/base.rhy")\n\n@section("content")\n  <h1>Generated Content</h1>\n  <p>This is a placeholder response to the prompt.</p>\n@endsection`,
          success: true
        };
      }
    } catch (error) {
      console.error('Error generating code:', error);
      return {
        content: '',
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }
  
  private extractFileType(prompt: string): string {
    const fileTypes = ['page', 'component', 'layout', 'template'];
    for (const type of fileTypes) {
      if (prompt.toLowerCase().includes(type)) {
        return type;
      }
    }
    return 'page'; // Default to page
  }
  
  private generateRhythmTemplate(fileType: string, prompt: string): string {
    switch (fileType) {
      case 'page':
        return `@extends("layout/base.rhy")\n\n@section("title") New Page @endsection\n\n@section("content")\n  <h1>New Page</h1>\n  <p>This is a new page generated from the prompt: "${prompt}"</p>\n  \n  @if(user.isLoggedIn)\n    <div class="user-greeting">\n      <p>Welcome back, {{ user.name }}!</p>\n    </div>\n  @endif\n@endsection`;
        
      case 'component':
        return `@block("component")\n  <div class="component">\n    <h2>{{ title }}</h2>\n    <div class="component-content">\n      {{ content }}\n    </div>\n    <div class="component-footer">\n      <button>{{ buttonText || "Submit" }}</button>\n    </div>\n  </div>\n@endblock`;
        
      case 'layout':
        return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>@yield("title") | My Site</title>\n  @use("theme/main")\n</head>\n<body>\n  <header>\n    <nav>\n      <!-- Navigation content -->\n    </nav>\n  </header>\n  \n  <main>\n    @yield("content")\n  </main>\n  \n  <footer>\n    <p>&copy; 2023 My Site</p>\n  </footer>\n</body>\n</html>`;
        
      case 'template':
        return `@extends("layout/base.rhy")\n\n@section("title") Template @endsection\n\n@section("content")\n  <div class="template">\n    <h1>{{ heading }}</h1>\n    \n    @each(item in items)\n      <div class="item">\n        <h3>{{ item.title }}</h3>\n        <p>{{ item.description }}</p>\n      </div>\n    @endloop\n    \n    @ai("summarize")\n      This template displays a collection of items with their titles and descriptions.\n    @endai\n  </div>\n@endsection`;
        
      default:
        return `@extends("layout/base.rhy")\n\n@section("title") Generated File @endsection\n\n@section("content")\n  <h1>Generated Content</h1>\n  <p>Generated from prompt: "${prompt}"</p>\n@endsection`;
    }
  }
  
  private generateLandingPage(prompt: string): string {
    return `@extends("layout/page.rhy")

@section("title") Modern Landing Page @endsection

@section("content")
  <header class="hero">
    <div class="container">
      <h1 class="hero-title">Welcome to Our Platform</h1>
      <p class="hero-subtitle">The next generation solution for ${prompt.includes('for') ? prompt.split('for')[1].trim() : 'your business needs'}</p>
      
      <div class="hero-cta">
        <a href="#features" class="btn btn-primary">Learn More</a>
        <a href="/signup" class="btn btn-outline">Get Started</a>
      </div>
    </div>
  </header>
  
  <section id="features" class="section">
    <div class="container">
      <h2 class="section-title">Key Features</h2>
      
      <div class="features-grid">
        <div class="feature-card">
          <i class="feature-icon ri-speed-line"></i>
          <h3>Lightning Fast</h3>
          <p>Optimized performance for the best user experience</p>
        </div>
        
        <div class="feature-card">
          <i class="feature-icon ri-shield-check-line"></i>
          <h3>Secure by Design</h3>
          <p>Enterprise-grade security to protect your data</p>
        </div>
        
        <div class="feature-card">
          <i class="feature-icon ri-device-line"></i>
          <h3>Responsive Design</h3>
          <p>Perfect experience on any device, any screen size</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="section section-alt">
    <div class="container">
      <div class="split-content">
        <div class="split-text">
          <h2>Why Choose Us?</h2>
          <p>We provide the most comprehensive solution in the market with unmatched quality and support.</p>
          
          <ul class="check-list">
            <li>24/7 dedicated support team</li>
            <li>Regular updates and new features</li>
            <li>Flexible pricing plans for any budget</li>
            <li>Free onboarding and training</li>
          </ul>
        </div>
        
        <div class="split-image">
          <img src="/assets/images/dashboard-preview.jpg" alt="Platform Preview" />
        </div>
      </div>
    </div>
  </section>
  
  <section class="section">
    <div class="container">
      <h2 class="section-title">Testimonials</h2>
      
      <div class="testimonial-slider">
        @each(testimonial in testimonials)
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"{{ testimonial.quote }}"</p>
            </div>
            <div class="testimonial-author">
              <img src="{{ testimonial.avatar }}" alt="{{ testimonial.name }}" />
              <div>
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.title }}, {{ testimonial.company }}</p>
              </div>
            </div>
          </div>
        @endloop
      </div>
    </div>
  </section>
  
  <section class="section section-cta">
    <div class="container text-center">
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of satisfied customers today.</p>
      <a href="/signup" class="btn btn-primary btn-lg">Start Your Free Trial</a>
    </div>
  </section>
@endsection

@section("styles")
<style>
  .hero {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    color: white;
    padding: 6rem 0;
    text-align: center;
  }
  
  .hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
    margin-bottom: 2rem;
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .section {
    padding: 5rem 0;
  }
  
  .section-alt {
    background-color: var(--dark-50);
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    color: var(--primary-500);
    margin-bottom: 1rem;
  }
  
  .split-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  
  .check-list {
    margin-top: 1.5rem;
    list-style: none;
    padding: 0;
  }
  
  .check-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .check-list li:before {
    content: "✓";
    color: var(--primary-500);
    position: absolute;
    left: 0;
  }
  
  .split-image img {
    border-radius: 0.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    width: 100%;
  }
  
  .testimonial-slider {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .testimonial-card {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
  }
  
  .testimonial-author img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
  }
  
  .section-cta {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    color: white;
    padding: 4rem 0;
  }
</style>
@endsection

@section("scripts")
<script>
  // Sample data for testimonials
  const testimonials = [
    {
      quote: "This platform has transformed our business operations. We've seen a 40% increase in productivity since implementing it.",
      name: "Sarah Johnson",
      title: "CTO",
      company: "Acme Inc",
      avatar: "/assets/images/testimonials/sarah.jpg"
    },
    {
      quote: "The customer service is exceptional. Any time we've had an issue, the team has resolved it within hours.",
      name: "Michael Roberts",
      title: "Operations Manager",
      company: "Tech Solutions",
      avatar: "/assets/images/testimonials/michael.jpg"
    },
    {
      quote: "We evaluated five different platforms before choosing this one. The decision has paid off tremendously.",
      name: "Jessica Williams",
      title: "CEO",
      company: "Startup Studio",
      avatar: "/assets/images/testimonials/jessica.jpg"
    }
  ];
</script>
@endsection`;
  }
  
  private generateBlogTemplate(prompt: string): string {
    return `@extends("layout/page.rhy")

@section("title") ${prompt.includes('about') ? prompt.split('about')[1].trim() : 'Blog Post'} @endsection

@section("content")
  <div class="blog-container">
    <article class="blog-post">
      <header class="post-header">
        <h1 class="post-title">${prompt.includes('about') ? prompt.split('about')[1].trim() : 'Blog Post Title'}</h1>
        
        <div class="post-meta">
          <span class="post-author">
            <i class="ri-user-line"></i> John Doe
          </span>
          <span class="post-date">
            <i class="ri-calendar-line"></i> {{ new Date().toLocaleDateString() }}
          </span>
          <span class="post-category">
            <i class="ri-price-tag-3-line"></i> Technology
          </span>
        </div>
        
        <div class="post-featured-image">
          <img src="/assets/images/blog/featured.jpg" alt="Featured Image" />
        </div>
      </header>
      
      <div class="post-content">
        <p class="post-intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        
        <h2>Introduction</h2>
        <p>
          Nulla facilisi. Mauris efficitur, ante eu pretium ultricies, purus nisi fermentum est, vel finibus justo quam nec erat. Etiam cursus, nisl eget hendrerit tincidunt, justo nisl porttitor justo, eget volutpat magna nibh at elit.
        </p>
        
        <h2>Main Section</h2>
        <p>
          Suspendisse iaculis, velit eget egestas facilisis, eros magna tempus odio, ac feugiat magna magna nec urna. Donec ut felis ultricies, cursus ex eu, sollicitudin est. Phasellus varius ex vel ex sagittis auctor. Nullam sodales augue eget libero euismod, ut interdum est facilisis.
        </p>
      </div>
    </article>
  </div>
@endsection

@section("styles")
<style>
  .blog-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
  }
  
  .post-header {
    margin-bottom: 2rem;
  }
  
  .post-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--dark-900);
  }
  
  .post-meta {
    display: flex;
    gap: 1rem;
    color: var(--dark-500);
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
  
  .post-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .post-featured-image {
    margin-bottom: 2rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .post-featured-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  
  .post-intro {
    font-size: 1.2rem;
    color: var(--dark-700);
    margin-bottom: 2rem;
    line-height: 1.6;
    border-left: 4px solid var(--primary-500);
    padding-left: 1rem;
  }
  
  .post-content h2 {
    margin: 2rem 0 1rem;
    color: var(--dark-800);
  }
  
  .post-content p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: var(--dark-700);
  }
</style>
@endsection`;
  }
  
  private generateDashboardTemplate(prompt: string): string {
    return `@extends("layout/page.rhy")

@section("title") Admin Dashboard @endsection

@section("content")
  <div class="dashboard-container">
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="ri-dashboard-line"></i>
          <span>Admin Portal</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li class="active">
            <a href="/dashboard">
              <i class="ri-home-line"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/users">
              <i class="ri-user-line"></i>
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="/analytics">
              <i class="ri-bar-chart-line"></i>
              <span>Analytics</span>
            </a>
          </li>
          <li>
            <a href="/products">
              <i class="ri-shopping-bag-line"></i>
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/settings">
              <i class="ri-settings-line"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main class="dashboard-main">
      <header class="main-header">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input type="text" placeholder="Search..." />
        </div>
        
        <div class="header-actions">
          <button class="notification-btn">
            <i class="ri-notification-line"></i>
            <span class="badge">3</span>
          </button>
          
          <div class="user-menu">
            <img src="/assets/images/avatar.jpg" alt="User" />
            <span>Admin User</span>
            <i class="ri-arrow-down-s-line"></i>
          </div>
        </div>
      </header>
      
      <div class="dashboard-content">
        <div class="page-header">
          <h1>Dashboard Overview</h1>
          <div class="date-range">
            <button>
              <i class="ri-calendar-line"></i>
              <span>Last 30 Days</span>
              <i class="ri-arrow-down-s-line"></i>
            </button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-title">Total Users</span>
              <span class="stat-value">2,543</span>
              <span class="stat-change positive">
                <i class="ri-arrow-up-line"></i>
                12.5%
              </span>
            </div>
            <div class="stat-icon">
              <i class="ri-user-line"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-title">Revenue</span>
              <span class="stat-value">$42,890</span>
              <span class="stat-change positive">
                <i class="ri-arrow-up-line"></i>
                8.2%
              </span>
            </div>
            <div class="stat-icon">
              <i class="ri-money-dollar-circle-line"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-title">Orders</span>
              <span class="stat-value">487</span>
              <span class="stat-change negative">
                <i class="ri-arrow-down-line"></i>
                3.4%
              </span>
            </div>
            <div class="stat-icon">
              <i class="ri-shopping-cart-line"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-title">Conversion</span>
              <span class="stat-value">3.6%</span>
              <span class="stat-change positive">
                <i class="ri-arrow-up-line"></i>
                0.8%
              </span>
            </div>
            <div class="stat-icon">
              <i class="ri-line-chart-line"></i>
            </div>
          </div>
        </div>
        
        <div class="dashboard-row">
          <div class="chart-container">
            <div class="chart-header">
              <h2>Revenue Overview</h2>
              <div class="chart-actions">
                <button>Weekly</button>
                <button class="active">Monthly</button>
                <button>Yearly</button>
              </div>
            </div>
            <div class="chart-content">
              <!-- Chart will be rendered here -->
              <div class="chart-placeholder">
                <div class="bar-chart">
                  <div class="bar" style="height: 40%"><span>Jan</span></div>
                  <div class="bar" style="height: 60%"><span>Feb</span></div>
                  <div class="bar" style="height: 45%"><span>Mar</span></div>
                  <div class="bar" style="height: 70%"><span>Apr</span></div>
                  <div class="bar" style="height: 65%"><span>May</span></div>
                  <div class="bar active" style="height: 90%"><span>Jun</span></div>
                  <div class="bar" style="height: 85%"><span>Jul</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="recent-activity">
            <div class="activity-header">
              <h2>Recent Activity</h2>
              <a href="/activities">View All</a>
            </div>
            
            <ul class="activity-list">
              <li class="activity-item">
                <div class="activity-icon user">
                  <i class="ri-user-add-line"></i>
                </div>
                <div class="activity-details">
                  <p>New user registered</p>
                  <span class="activity-time">2 minutes ago</span>
                </div>
              </li>
              
              <li class="activity-item">
                <div class="activity-icon order">
                  <i class="ri-shopping-bag-line"></i>
                </div>
                <div class="activity-details">
                  <p>New order #1242 from John Doe</p>
                  <span class="activity-time">45 minutes ago</span>
                </div>
              </li>
              
              <li class="activity-item">
                <div class="activity-icon payment">
                  <i class="ri-bank-card-line"></i>
                </div>
                <div class="activity-details">
                  <p>Payment received for order #1240</p>
                  <span class="activity-time">1 hour ago</span>
                </div>
              </li>
              
              <li class="activity-item">
                <div class="activity-icon alert">
                  <i class="ri-alert-line"></i>
                </div>
                <div class="activity-details">
                  <p>Inventory low for Product A</p>
                  <span class="activity-time">3 hours ago</span>
                </div>
              </li>
              
              <li class="activity-item">
                <div class="activity-icon settings">
                  <i class="ri-settings-line"></i>
                </div>
                <div class="activity-details">
                  <p>System settings updated</p>
                  <span class="activity-time">5 hours ago</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
@endsection

@section("styles")
<style>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: var(--dark-50);
  }
  
  .dashboard-sidebar {
    width: 260px;
    background-color: var(--dark-900);
    color: white;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .logo i {
    font-size: 1.5rem;
    margin-right: 0.5rem;
    color: var(--primary-500);
  }
  
  .sidebar-nav {
    padding: 1.5rem 0;
  }
  
  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-nav li {
    margin-bottom: 0.25rem;
  }
  
  .sidebar-nav a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .sidebar-nav a:hover {
    background-color: rgba(255,255,255,0.05);
    color: white;
  }
  
  .sidebar-nav li.active a {
    background-color: var(--primary-600);
    color: white;
    border-right: 3px solid var(--primary-300);
  }
  
  .sidebar-nav a i {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
  
  .dashboard-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .main-header {
    background-color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: var(--dark-50);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    width: 300px;
  }
  
  .search-box i {
    color: var(--dark-500);
    margin-right: 0.5rem;
  }
  
  .search-box input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    color: var(--dark-800);
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .notification-btn {
    background: none;
    border: none;
    position: relative;
    cursor: pointer;
    color: var(--dark-700);
    font-size: 1.2rem;
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: var(--error-500);
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .user-menu {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .user-menu img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.5rem;
  }
  
  .dashboard-content {
    padding: 2rem;
    flex: 1;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .date-range button {
    background-color: white;
    border: 1px solid var(--dark-200);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .stat-info {
    display: flex;
    flex-direction: column;
  }
  
  .stat-title {
    color: var(--dark-500);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .stat-change.positive {
    color: var(--success-500);
  }
  
  .stat-change.negative {
    color: var(--error-500);
  }
  
  .stat-icon {
    font-size: 2.5rem;
    color: var(--primary-500);
    opacity: 0.2;
  }
  
  .dashboard-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
  }
  
  .chart-container, .recent-activity {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .chart-header, .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .chart-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .chart-actions button {
    background: none;
    border: 1px solid var(--dark-200);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .chart-actions button.active {
    background-color: var(--primary-500);
    color: white;
    border-color: var(--primary-500);
  }
  
  .chart-content {
    height: 300px;
    display: flex;
    align-items: flex-end;
  }
  
  .chart-placeholder {
    width: 100%;
    height: 100%;
  }
  
  .bar-chart {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 2rem;
  }
  
  .bar {
    flex: 1;
    background-color: var(--primary-100);
    margin: 0 0.5rem;
    position: relative;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
  }
  
  .bar span {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: var(--dark-500);
  }
  
  .bar:hover, .bar.active {
    background-color: var(--primary-500);
  }
  
  .activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .activity-item {
    display: flex;
    padding: 1rem 0;
    border-bottom: 1px solid var(--dark-100);
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .activity-icon.user {
    background-color: var(--primary-100);
    color: var(--primary-500);
  }
  
  .activity-icon.order {
    background-color: var(--success-100);
    color: var(--success-500);
  }
  
  .activity-icon.payment {
    background-color: var(--info-100);
    color: var(--info-500);
  }
  
  .activity-icon.alert {
    background-color: var(--error-100);
    color: var(--error-500);
  }
  
  .activity-icon.settings {
    background-color: var(--warning-100);
    color: var(--warning-500);
  }
  
  .activity-details p {
    margin: 0 0 0.25rem;
    color: var(--dark-800);
  }
  
  .activity-time {
    font-size: 0.8rem;
    color: var(--dark-500);
  }
  
  @media (max-width: 992px) {
    .dashboard-row {
      grid-template-columns: 1fr;
    }
    
    .dashboard-sidebar {
      width: 80px;
    }
    
    .sidebar-nav a span, .logo span {
      display: none;
    }
    
    .sidebar-nav a i {
      margin-right: 0;
    }
    
    .logo {
      justify-content: center;
    }
    
    .logo i {
      margin-right: 0;
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .search-box {
      width: 100%;
      max-width: 200px;
    }
  }
</style>
@endsection

@section("scripts")
<script>
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', value: 12500 },
    { month: 'Feb', value: 18200 },
    { month: 'Mar', value: 15800 },
    { month: 'Apr', value: 22000 },
    { month: 'May', value: 19500 },
    { month: 'Jun', value: 28700 },
    { month: 'Jul', value: 26500 }
  ];
  
  // Initialize interactive elements
  document.addEventListener('DOMContentLoaded', function() {
    // User menu dropdown toggle
    const userMenu = document.querySelector('.user-menu');
    userMenu.addEventListener('click', function() {
      // Toggle dropdown visibility
      console.log('User menu clicked');
    });
    
    // Chart period selector
    const chartButtons = document.querySelectorAll('.chart-actions button');
    chartButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        chartButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Update chart data based on period
        console.log('Chart period changed to:', this.textContent);
      });
    });
  });
</script>
@endsection`;
  }
  
  private generateFormTemplate(prompt: string): string {
    return `@extends("layout/page.rhy")

@section("title") Contact Form @endsection

@section("content")
  <div class="form-container">
    <div class="form-header">
      <h1>${prompt.includes('contact') ? 'Contact Us' : 'Form Demo'}</h1>
      <p>We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</p>
    </div>
    
    <form id="contactForm" class="contact-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="firstName">First Name <span class="required">*</span></label>
          <input type="text" id="firstName" name="firstName" required>
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name <span class="required">*</span></label>
          <input type="text" id="lastName" name="lastName" required>
        </div>
      </div>
      
      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone">
      </div>
      
      <div class="form-group">
        <label for="subject">Subject <span class="required">*</span></label>
        <select id="subject" name="subject" required>
          <option value="">Please select...</option>
          <option value="general">General Inquiry</option>
          <option value="support">Technical Support</option>
          <option value="billing">Billing Question</option>
          <option value="partnership">Partnership Opportunity</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="message">Message <span class="required">*</span></label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      
      <div class="form-group checkbox-group">
        <input type="checkbox" id="newsletter" name="newsletter">
        <label for="newsletter">Subscribe to our newsletter</label>
      </div>
      
      <div class="form-group">
        <button type="submit" class="btn-primary">Submit</button>
        <button type="reset" class="btn-outline">Reset</button>
      </div>
      
      <div id="formStatus" class="form-status"></div>
    </form>
  </div>
@endsection

@section("styles")
<style>
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-header h1 {
    color: var(--dark-900);
    margin-bottom: 0.5rem;
  }
  
  .form-header p {
    color: var(--dark-600);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--dark-800);
  }
  
  .required {
    color: var(--error-500);
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid var(--dark-200);
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
  }
  
  .checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
  
  .btn-primary {
    background-color: var(--primary-600);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-700);
  }
  
  .btn-outline {
    background: none;
    border: 1px solid var(--dark-300);
    color: var(--dark-700);
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 1rem;
  }
  
  .btn-outline:hover {
    border-color: var(--dark-400);
    color: var(--dark-900);
  }
  
  .form-status {
    padding: 1rem;
    border-radius: 4px;
    font-weight: 500;
    display: none;
  }
  
  .form-status.success {
    display: block;
    background-color: var(--success-50);
    color: var(--success-700);
    border: 1px solid var(--success-200);
  }
  
  .form-status.error {
    display: block;
    background-color: var(--error-50);
    color: var(--error-700);
    border: 1px solid var(--error-200);
  }
  
  .form-group.error input,
  .form-group.error select,
  .form-group.error textarea {
    border-color: var(--error-500);
  }
  
  .form-group.error .error-message {
    color: var(--error-500);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style>
@endsection

@section("scripts")
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset previous errors
      const errorElements = document.querySelectorAll('.error-message');
      errorElements.forEach(el => el.remove());
      
      const errorGroups = document.querySelectorAll('.form-group.error');
      errorGroups.forEach(group => group.classList.remove('error'));
      
      // Validate form
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          const group = field.closest('.form-group');
          group.classList.add('error');
          
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = 'This field is required';
          group.appendChild(errorMessage);
        }
      });
      
      // Email validation
      const emailField = form.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailField.value.trim() && !emailRegex.test(emailField.value)) {
        isValid = false;
        const group = emailField.closest('.form-group');
        group.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Please enter a valid email address';
        group.appendChild(errorMessage);
      }
      
      if (isValid) {
        // Simulate form submission
        formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
        formStatus.className = 'form-status success';
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      } else {
        formStatus.textContent = 'Please correct the errors in the form.';
        formStatus.className = 'form-status error';
      }
    });
  });
</script>
@endsection`;
  }
  
  private generateExplanation(code: string): string {
    if (!code) {
      return 'No code provided to explain.';
    }
    
    // Simple explanation generator
    let explanation = '## Rhythm Code Explanation\n\n';
    
    if (code.includes('@extends')) {
      explanation += '- This file extends a base layout template.\n';
    }
    
    if (code.includes('@section')) {
      explanation += '- It defines content sections that will be placed into the layout.\n';
    }
    
    if (code.includes('@if') || code.includes('@elseif') || code.includes('@else')) {
      explanation += '- Contains conditional logic to display different content based on conditions.\n';
    }
    
    if (code.includes('@loop') || code.includes('@each')) {
      explanation += '- Uses loops to iterate over collections of data.\n';
    }
    
    if (code.includes('@ai')) {
      explanation += '- Incorporates AI directives for dynamic content generation.\n';
    }
    
    if (code.includes('<script>')) {
      explanation += '- Contains embedded JavaScript for client-side functionality.\n';
    }
    
    return explanation;
  }
}

export const aiService = new AIService();
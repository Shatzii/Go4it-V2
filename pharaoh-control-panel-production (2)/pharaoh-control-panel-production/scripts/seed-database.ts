import { db } from '../server/db';
import { marketplaceModels } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

// Sample data for marketplace models
const sampleModels = [
  {
    id: uuidv4(),
    name: 'Root Cause Analyzer',
    description: 'Advanced AI model for diagnosing server issues and identifying root causes of problems.',
    type: 'diagnostic',
    icon: 'activity',
    memory: '2GB',
    verified: true,
    featured: true,
    badge: 'Popular',
    color: '#3B82F6',
    status: 'active',
    category: 'diagnostics',
    rating: 4.8,
    reviewCount: 127,
    price: 'Free',
    publisherName: 'Pharaoh AI',
    publisherVerified: true,
    premium: false
  },
  {
    id: uuidv4(),
    name: 'Performance Optimizer',
    description: 'Analyzes server performance and provides optimization recommendations.',
    type: 'optimization',
    icon: 'zap',
    memory: '1.5GB',
    verified: true,
    featured: true,
    badge: 'New',
    color: '#10B981',
    status: 'active',
    category: 'optimization',
    rating: 4.6,
    reviewCount: 89,
    price: 'Free',
    publisherName: 'Pharaoh AI',
    publisherVerified: true,
    premium: false
  },
  {
    id: uuidv4(),
    name: 'Security Auditor Pro',
    description: 'Enterprise-grade security scanner for detecting vulnerabilities in server configurations.',
    type: 'security',
    icon: 'shield',
    memory: '3GB',
    verified: true,
    featured: false,
    badge: 'Premium',
    color: '#EF4444',
    status: 'active',
    category: 'security',
    rating: 4.9,
    reviewCount: 76,
    price: 'Premium',
    publisherName: 'CyberSec Labs',
    publisherVerified: true,
    premium: true
  },
  {
    id: uuidv4(),
    name: 'Server Documentation Generator',
    description: 'Automatically generates comprehensive documentation for your server infrastructure.',
    type: 'documentation',
    icon: 'file-text',
    memory: '1GB',
    verified: true,
    featured: false,
    badge: null,
    color: '#6366F1',
    status: 'active',
    category: 'documentation',
    rating: 4.5,
    reviewCount: 52,
    price: 'Free',
    publisherName: 'DevDocs AI',
    publisherVerified: true,
    premium: false
  },
  {
    id: uuidv4(),
    name: 'Database Optimizer',
    description: 'Analyzes database queries and schema for optimization opportunities.',
    type: 'database',
    icon: 'database',
    memory: '2GB',
    verified: true,
    featured: false,
    badge: null,
    color: '#8B5CF6',
    status: 'active',
    category: 'optimization',
    rating: 4.7,
    reviewCount: 68,
    price: 'Free',
    publisherName: 'DataTune AI',
    publisherVerified: true,
    premium: false
  }
];

// Seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with marketplace models...');
    
    // Insert models
    for (const model of sampleModels) {
      await db.insert(marketplaceModels).values(model).onConflictDoNothing();
    }
    
    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
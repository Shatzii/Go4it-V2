import { eq } from 'drizzle-orm';
import { db } from '../server/db';
import { users, blogPosts } from '../shared/schema';
import { generateSlug } from '../server/utils';

async function createCombineTourPost() {
  try {
    console.log('Creating Get Verified Combine Tour blog post...');
    
    // Find admin user to use as author
    const adminUsersResult = await db.select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);
    
    if (!adminUsersResult || adminUsersResult.length === 0) {
      console.error('No admin user found to use as blog author');
      return;
    }
    
    const adminUserId = adminUsersResult[0].id;
    
    // Blog post content
    const title = "Announcing the GO4IT Get Verified Combine Tour 2025: US and Europe";
    const slug = generateSlug(title);
    
    const summary = "GO4IT Sports is proud to announce our groundbreaking Get Verified Combine Tour across the United States and Europe, featuring state-of-the-art AI athlete analysis technology and a comprehensive rating system.";
    
    const content = `We are thrilled to announce the launch of the GO4IT Get Verified Combine Tour 2025, a revolutionary athletic evaluation program spanning major cities across the United States and Europe. This tour represents a significant leap forward in how athletes are evaluated and rated, using our proprietary AI-powered technology to deliver the most comprehensive athletic assessment available today.

## Tour Dates and Locations

### United States Tour
- **Los Angeles, CA:** January 15-17, 2025
- **Dallas, TX:** January 24-26, 2025
- **Miami, FL:** February 7-9, 2025
- **Atlanta, GA:** February 14-16, 2025
- **Chicago, IL:** February 28-March 2, 2025
- **New York, NY:** March 14-16, 2025

### European Tour
- **London, UK:** April 4-6, 2025
- **Paris, France:** April 18-20, 2025
- **Berlin, Germany:** May 2-4, 2025
- **Madrid, Spain:** May 16-18, 2025
- **Rome, Italy:** May 30-June 1, 2025

## Revolutionary AI-Powered Athletic Analysis

What sets the Get Verified Combine apart is our cutting-edge AI assessment technology. Athletes will undergo comprehensive evaluations using our proprietary system that analyzes:

- **Physical Metrics:** Speed, agility, vertical jump, strength, and sport-specific movements
- **Technical Skills:** Sport-specific skill assessments with AI motion analysis
- **Cognitive Performance:** Decision-making speed, pattern recognition, and situational awareness
- **Athletic Potential:** AI-driven projections of development potential based on current metrics

## The Total Athlete Rating System

Our innovative Total Athlete Rating (TAR) provides the most comprehensive evaluation in sports. Unlike traditional combines that focus primarily on physical metrics, our system delivers:

- **Multidimensional Assessment:** Evaluation across physical, technical, cognitive, and character dimensions
- **Personalized Improvement Roadmap:** Custom-tailored development plans based on your results
- **Recruiter-Verified Reports:** Detailed analysis reports developed in conjunction with college and professional scouts
- **Digital Athlete Profile:** Secure, shareable profile with your verified metrics and highlight analysis

## Why Attend the Get Verified Combine

- **Exposure to Recruiters:** Digital profiles and metrics shared with our network of 1,000+ college and professional scouts
- **Verified Credentials:** Eliminate questions about your athletic abilities with independently verified metrics
- **Performance Insights:** Gain valuable feedback about your strengths and areas for improvement
- **Development Roadmap:** Receive a customized training plan based on your assessment results

## Registration Information

Registration for the GO4IT Get Verified Combine Tour 2025 opens on November 1, 2024. Early registration discounts are available for the first 100 athletes at each location.

For more information or to pre-register, visit the [Combine Registration Page](/combines) or contact our Combine Team at combines@go4itsports.com.

---

Don't miss this revolutionary opportunity to have your athletic abilities professionally evaluated and verified using the most advanced sports technology available today. The GO4IT Get Verified Combine Tour is changing how athletes are discovered and developed—be part of the future of athletic assessment.`;

    const coverImage = "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800"; // Stadium with athletes
    
    // Create blog post
    await db.insert(blogPosts).values({
      title,
      content,
      summary,
      slug,
      category: "technology", // Using the technology category since it's about AI tech
      authorId: adminUserId,
      publishDate: new Date(),
      featured: true, // Make it featured since it's an important announcement
      tags: ["combines", "athlete evaluation", "AI technology", "sports tech", "tour", "europe", "united states"],
      coverImage
    });
    
    console.log('Get Verified Combine Tour blog post created successfully!');
  } catch (error) {
    console.error('Error creating combine tour blog post:', error);
  }
}

// Run the function
createCombineTourPost()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
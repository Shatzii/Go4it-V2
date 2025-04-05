import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateCombineTourImages() {
  try {
    console.log('Updating Get Verified Combine Tour blog post with tour date images...');
    
    // Get the blog post by its slug
    const blogPostResult = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, 'announcing-the-go4it-get-verified-combine-tour-2025-us-and-europe'))
      .limit(1);
    
    if (!blogPostResult || blogPostResult.length === 0) {
      console.error('Blog post not found');
      return;
    }
    
    const blogPost = blogPostResult[0];
    console.log(`Found blog post: ${blogPost.title}`);
    
    // Create uploads directory for blog images
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blog');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Copy the tour date images from attached_assets to uploads/blog
    const sourceImage1 = path.join(process.cwd(), 'attached_assets', 'Tour Dates .zip - 1.jpeg');
    const sourceImage2 = path.join(process.cwd(), 'attached_assets', 'Tour Dates .zip - 2.jpeg');
    
    const destImage1 = path.join(uploadsDir, 'tour-dates-us-2025.jpeg');
    const destImage2 = path.join(uploadsDir, 'tour-dates-europe-2025.jpeg');
    
    // Check if source images exist
    if (!fs.existsSync(sourceImage1) || !fs.existsSync(sourceImage2)) {
      console.error('Source images not found. Check the file paths.');
      return;
    }
    
    // Copy the images
    fs.copyFileSync(sourceImage1, destImage1);
    fs.copyFileSync(sourceImage2, destImage2);
    
    console.log('Images copied to uploads folder');
    
    // Update the blog post content to include the images
    let content = blogPost.content;
    
    // Replace or add the image references in the content
    // We'll add the images after the tour dates sections
    const usSection = '### United States Tour';
    const europeSection = '### European Tour';
    
    // Add image after US tour dates
    if (content.includes(usSection)) {
      const insertAfter = '- **New York, NY:** March 14-16, 2025';
      const imageMarkdown = `\n\n![United States Tour Dates](/uploads/blog/tour-dates-us-2025.jpeg)`;
      
      content = content.replace(
        insertAfter,
        `${insertAfter}${imageMarkdown}`
      );
    }
    
    // Add image after Europe tour dates
    if (content.includes(europeSection)) {
      const insertAfter = '- **Rome, Italy:** May 30-June 1, 2025';
      const imageMarkdown = `\n\n![European Tour Dates](/uploads/blog/tour-dates-europe-2025.jpeg)`;
      
      content = content.replace(
        insertAfter,
        `${insertAfter}${imageMarkdown}`
      );
    }
    
    // Update the blog post cover image
    const coverImage = '/uploads/blog/tour-dates-us-2025.jpeg';
    
    // Update the blog post in the database
    await db.update(blogPosts)
      .set({
        content: content,
        coverImage: coverImage
      })
      .where(eq(blogPosts.id, blogPost.id));
    
    console.log('Blog post updated with tour date images');
  } catch (error) {
    console.error('Error updating blog post:', error);
  }
}

// Run the function
updateCombineTourImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
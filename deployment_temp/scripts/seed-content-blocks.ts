import { db } from "../server/db";
import { contentBlocks } from "../shared/schema";

async function seedContentBlocks() {
  try {
    console.log("Seeding content blocks...");

    // Check if content blocks already exist for this section
    const existingBlocks = await db.select().from(contentBlocks).where(() => {
      return contentBlocks.section === "what-makes-us-different";
    });

    if (existingBlocks.length > 0) {
      console.log("Content blocks already exist for the 'What Makes Us Different' section.");
      return;
    }

    // Insert "What Makes Us Different" content blocks
    const blocks = [
      {
        identifier: "ai-motion-analysis",
        title: "AI Motion Analysis",
        content: "Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy.",
        section: "what-makes-us-different",
        order: 1,
        active: true,
        metadata: {
          iconName: "brain-circuit",
          backgroundColor: "bg-blue-100"
        }
      },
      {
        identifier: "verified-combines",
        title: "Verified Combines",
        content: "Participate in certified athletic combines where your performance metrics are verified by professionals.",
        section: "what-makes-us-different",
        order: 2,
        active: true,
        metadata: {
          iconName: "badge-check",
          backgroundColor: "bg-green-100"
        }
      },
      {
        identifier: "direct-scout-connection",
        title: "Direct Scout Connection",
        content: "Connect directly with college recruiters looking for talented athletes like you.",
        section: "what-makes-us-different",
        order: 3,
        active: true,
        metadata: {
          iconName: "users",
          backgroundColor: "bg-purple-100"
        }
      },
      {
        identifier: "personalized-development",
        title: "Personalized Development",
        content: "Receive customized training programs based on your unique athletic profile and goals.",
        section: "what-makes-us-different",
        order: 4,
        active: true,
        metadata: {
          iconName: "trending-up",
          backgroundColor: "bg-amber-100"
        }
      }
    ];

    // Insert the blocks
    const results = await db.insert(contentBlocks).values(blocks);

    console.log("Content blocks seeded successfully!");
    console.log(`Inserted ${blocks.length} content blocks.`);
  } catch (error) {
    console.error("Error seeding content blocks:", error);
  } finally {
    process.exit(0);
  }
}

seedContentBlocks();
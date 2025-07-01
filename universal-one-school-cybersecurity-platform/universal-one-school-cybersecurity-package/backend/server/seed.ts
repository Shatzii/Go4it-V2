import { storage } from "./storage";
import bcrypt from "bcrypt";

/**
 * Seeds the database with initial test data
 */
export async function seedDatabase() {
  try {
    console.log("Checking for existing users...");
    const existingAdmin = await storage.getUserByUsername("admin");
    
    if (!existingAdmin) {
      console.log("Creating admin user...");
      // Create admin user
      const hashedPassword = await bcrypt.hash("sentinel123", 10);
      
      const admin = await storage.createUser({
        username: "admin",
        password: hashedPassword,
        email: "admin@sentinel.ai",
        role: "admin",
        clientId: null
      });
      
      console.log(`Created admin user with ID: ${admin.id}`);
      
      // Create a test client organization
      console.log("Creating test client...");
      const client = await storage.createClient({
        name: "Acme Corporation",
        domain: "acme.com",
        settings: {}
      });
      
      console.log(`Created client with ID: ${client.id}`);
      
      // Create a client user
      const clientUserPassword = await bcrypt.hash("sentinel123", 10);
      const clientUser = await storage.createUser({
        username: "user",
        password: clientUserPassword,
        email: "user@acme.com",
        role: "user",
        clientId: client.id
      });
      
      console.log(`Created client user with ID: ${clientUser.id}`);
    } else {
      console.log("Admin user already exists, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware for validating request body against a Zod schema
 * @param schema The Zod schema to validate against
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        // Format error messages
        const errors = validationResult.error.format();
        return res.status(400).json({ 
          message: "Validation failed",
          errors 
        });
      }
      
      // Replace request body with validated data
      req.body = validationResult.data;
      next();
    } catch (error) {
      console.error("Validation error:", error);
      return res.status(500).json({ message: "Validation error" });
    }
  };
};

/**
 * Middleware for validating query parameters against a Zod schema
 * @param schema The Zod schema to validate against
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query params against schema
      const validationResult = schema.safeParse(req.query);
      
      if (!validationResult.success) {
        // Format error messages
        const errors = validationResult.error.format();
        return res.status(400).json({ 
          message: "Query validation failed",
          errors 
        });
      }
      
      // Replace query with validated data
      req.query = validationResult.data;
      next();
    } catch (error) {
      console.error("Query validation error:", error);
      return res.status(500).json({ message: "Query validation error" });
    }
  };
};
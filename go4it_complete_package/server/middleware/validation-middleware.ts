import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Middleware for validating request body against a Zod schema
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        // If validation fails, format the error message
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          message: 'Validation error',
          errors: validationError.details.map(detail => ({
            path: detail.path,
            message: detail.message
          }))
        });
      }
      
      // If validation succeeds, replace the req.body with the validated data
      req.body = result.data;
      
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({ message: 'Error processing request' });
    }
  };
}
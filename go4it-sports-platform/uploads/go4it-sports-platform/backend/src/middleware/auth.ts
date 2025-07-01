import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // Fetch user from the database (pseudo code)
    const user = await getUserByUsername(username); // Implement this function

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.user = user; // Attach user to request
    next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
};
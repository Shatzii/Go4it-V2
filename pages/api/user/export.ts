import { NextApiRequest, NextApiResponse } from 'next';

// Dummy user export endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Authenticate user and fetch real data
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'User data export (stub)' });
}

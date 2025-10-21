import { NextApiRequest, NextApiResponse } from 'next';

// Dummy user delete endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Authenticate user and perform real deletion
  res.status(200).json({ message: 'User account deleted (stub)' });
}

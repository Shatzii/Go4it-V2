import express from 'express';
import { json } from 'body-parser';
import { clerkBridge } from './middleware/clerk-bridge';
import academicRoutes from './api/academic';
import coachRoutes from './api/coach';
import playerRoutes from './api/player';
import skillTreeRoutes from './api/skill-tree';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(json());
app.use(clerkBridge);

app.use('/api/academic', academicRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/skill-tree', skillTreeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
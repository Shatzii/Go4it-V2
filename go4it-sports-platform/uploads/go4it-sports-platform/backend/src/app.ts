import express from 'express';
import { json } from 'body-parser';
import { router as apiRoutes } from './routes/index';
import { errorHandler } from './middleware/auth';

const app = express();

// Middleware
app.use(json());
app.use('/api', apiRoutes);
app.use(errorHandler);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import corsMiddleware from '../../../shared/middleware/cors';
import { errorHandler } from '../../../shared/middleware/errorHandler';
import storyRoutes from '../routes/story';

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'story',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/story', storyRoutes);
app.use(errorHandler);

export default app;
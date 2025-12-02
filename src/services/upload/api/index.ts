import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import corsMiddleware from '../../../shared/middleware/cors';
import { errorHandler } from '../../../shared/middleware/errorHandler';
import uploadRoutes from '../routes/upload';

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Health check
app.get('/api/upload/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'upload',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/upload', uploadRoutes);
app.use(errorHandler);

export default app;
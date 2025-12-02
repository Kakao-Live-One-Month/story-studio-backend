import express from 'express';
import dotenv from 'dotenv';
import corsMiddleware from '../../../shared/middleware/cors';
import { errorHandler } from '../../../shared/middleware/errorHandler';
import storyRoutes from '../routes/story';

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/story', storyRoutes);
app.use(errorHandler);

export default app;
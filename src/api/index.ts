import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import corsMiddleware from '../middleware/cors';
import { errorHandler } from '../middleware/errorHandler';
import storyRoutes from '../routes/story';
import paymentRoutes from '../routes/payment';

// 환경 변수 로드 (로컬 개발용)
dotenv.config();

const app = express();

// 미들웨어
app.use(corsMiddleware);
app.use(express.json());

// 라우트
app.use('/api/story', storyRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 에러 핸들러 (마지막에)
app.use(errorHandler);

// Vercel Serverless 용
export default app;

// 로컬 개발용
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  });
}
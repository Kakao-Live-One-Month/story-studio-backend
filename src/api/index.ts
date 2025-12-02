import express from 'express';
import * as dotenv from 'dotenv';
import storyRoutes from '../services/story/routes';
import paymentRoutes from '../services/payment/routes';
// import pdfRoutes from '../services/pdf/routes';
import uploadRoutes from '../services/upload/routes';

dotenv.config();

const app = express();
app.use(express.json());

// 라우트 등록
app.use('/api/story', storyRoutes);
app.use('/api/payment', paymentRoutes);
// app.use('/api/pdf', pdfRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vercel Serverless용
export default app;

// 로컬 개발용
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
}
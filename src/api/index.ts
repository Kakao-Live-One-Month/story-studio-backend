import express from 'express';
import * as dotenv from 'dotenv';
import storyRoutes from '../services/story/routes';
import paymentRoutes from '../services/payment/routes';
import uploadRoutes from '../services/upload/routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/story', storyRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;

// 로컬 개발용
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
}

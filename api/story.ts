import express from 'express';
import storyRoutes from '../src/services/story/routes';

const app = express();
app.use(express.json());
app.use('/api/story', storyRoutes);

export default app;
import express from 'express';
import cors from 'cors';
import developerRoutes from './routes/developerRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { getSkills } from './services/projectService.js';
import { verifyConnection } from './db/connection.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', async (req, res, next) => {
  try { await verifyConnection(); res.json({ status: 'ok' }); }
  catch (error) { error.statusCode = 503; next(error); }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend routes are working' });
});

app.use('/api/developers', developerRoutes);
app.use('/api/projects', projectRoutes);
app.get('/api/skills', async (req, res, next) => { try { res.json({ data: await getSkills() }); } catch (error) { next(error); } });
app.use('/api/developers', recommendationRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use(errorHandler);
export default app;

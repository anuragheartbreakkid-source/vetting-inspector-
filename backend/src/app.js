import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import questionsRouter from './routes/questions.js';
import inspectionsRouter from './routes/inspections.js';
import observationsRouter from './routes/observations.js';
import crewRouter from './routes/crew.js';
import reportsRouter from './routes/reports.js';

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendBuildDirectory = path.resolve(moduleDirectory, '../../frontend/dist');

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'sire2-backend' });
  });

  app.use('/api/questions', questionsRouter);
  app.use('/api/inspections', inspectionsRouter);
  app.use('/api/observations', observationsRouter);
  app.use('/api/crew', crewRouter);
  app.use('/api/compliance', reportsRouter);
  app.use('/api/reports', reportsRouter);

  app.use(express.static(frontendBuildDirectory));

  app.use((req, res) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.sendFile('index.html', { root: frontendBuildDirectory });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export default createApp;

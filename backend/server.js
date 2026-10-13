import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';

import { connectDB } from './src/config/db.js';
import routes from './src/routes/index.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Security & parsing middleware ---
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — allow the configured client origin(s)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Basic rate limiting on the API
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Health check ---
app.get('/', (_req, res) => {
  res.json({
    name: 'College Placement & Alumni Portal API',
    status: 'ok',
    version: '1.0.0',
    docs: '/api',
  });
});

// --- API routes ---
app.use('/api', routes);

// --- 404 + error handling ---
app.use(notFound);
app.use(errorHandler);

// --- Boot ---
async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`\u2705 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('\u274c Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

export default app;

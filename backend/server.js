import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes.js';
import parserRoutes from './routes/parserRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';
import personalityRoutes from './routes/personalityRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment configuration parameters
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up cross-origin sharing for communication with the React app
app.use(cors());

// Body parser filters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Binds core API routing endpoints
app.use('/api', uploadRoutes);
app.use('/api', parserRoutes);
app.use('/api', ownerRoutes);
app.use('/api', trainingRoutes);
app.use('/api', analyzerRoutes);
app.use('/api', personalityRoutes);

// Backend diagnostics endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Digital Clone AI Backend API' });
});

// Centralized error boundary middleware catching upload errors
app.use(errorHandler);

// Boot server listener
app.listen(PORT, () => {
  console.log(`[Server] Digital Clone AI Backend booted successfully on port ${PORT}`);
});

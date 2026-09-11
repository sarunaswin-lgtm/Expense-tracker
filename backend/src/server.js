import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import dashboardRoutes from './routes/dashboard.js';
import transactionRoutes from './routes/transactions.js';
import recurringRoutes from './routes/recurring.js';
import aiRoutes from './routes/ai.js';
import { isSupabaseConfigured } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow local frontend and production deployments
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'WealthPulse API',
    version: '1.0.0',
    storageMode: isSupabaseConfigured ? 'Supabase PostgreSQL (Cloud)' : 'Local File Persistence',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim())
  });
});

// Mount Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 WealthPulse Backend listening on http://localhost:${PORT}`);
  console.log(`📊 Storage Mode: ${isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Storage Fallback'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'gemini-2.5-flash configured' : 'Using smart heuristic fallback until key added'}`);
});

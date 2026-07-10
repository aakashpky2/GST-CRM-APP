const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Strict Environment Variable Validation
const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missing = requiredEnv.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`CRITICAL STARTUP ERROR: Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const superadminRoutes = require('./routes/superadmin');
const learningVideosRoutes = require('./routes/learningVideos');
const creditsRoutes = require('./routes/credits');
const sessionRoutes = require('./routes/sessions');
const usersRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:", "http://localhost:5173", "http://localhost:5174", "http://localhost:5000"],
      connectSrc: ["'self'", "http://localhost:5174", "http://localhost:5000"],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  }
}));
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://gst-crm-app.vercel.app',
  'https://gst-app-gamma.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked origin'), false);
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(compression()); // Compress all responses

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, timestamp: new Date(), service: 'crm-app-backend' });
});
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api', creditsRoutes);
app.use('/api/learning/videos', learningVideosRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug env exists route for deployment diagnostics
app.get('/debug-env', (req, res) => {
  res.json({
    PORT: process.env.PORT,
    SUPABASE_URL_EXISTS: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY_EXISTS: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV
  });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

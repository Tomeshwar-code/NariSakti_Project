const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const footerRoutes = require('./routes/footerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const walletRoutes = require('./routes/walletRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');


const app = express();

// ============== Security Middleware ==============
// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// ============== Body Parser ==============
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

// ============== Compression ==============
app.use(compression());

// ============== Logging ==============
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============== Health Check ==============
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NariSakti API is running!',
    timestamp: new Date().toISOString()
  });
});

// ============== API Routes ==============
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/wallet', walletRoutes);
// ============== 404 Handler ==============
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// ============== Error Handler ==============
app.use(errorMiddleware);

module.exports = app;
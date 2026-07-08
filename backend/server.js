require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');



// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
  console.log(` API URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;
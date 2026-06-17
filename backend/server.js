const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database
  connectDB();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);

});

// handle unhandled promise rejections
process.on('unhandleRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle sigterm signal
process.on('SIGTERM', () => {
  console.log('SIGTERM  signal received: closing HTTP server');
  server.close(() => {
    console.log('http server closed');
  });
});
    module.exports = server;
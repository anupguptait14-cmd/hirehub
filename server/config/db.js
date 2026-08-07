const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirehub';

  // If URI has placeholder <YOUR_PASSWORD>, fallback to local MongoDB
  if (uri.includes('<YOUR_PASSWORD>') || uri.includes('<db_password>')) {
    console.warn('⚠️ MONGODB_URI contains password placeholder. Falling back to local MongoDB at mongodb://127.0.0.1:27017/hirehub');
    uri = 'mongodb://127.0.0.1:27017/hirehub';
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}`);
    // If primary cloud URI fails, try connecting to local MongoDB as fallback
    if (uri !== 'mongodb://127.0.0.1:27017/hirehub') {
      try {
        console.log('Attempting connection to local MongoDB fallback (mongodb://127.0.0.1:27017/hirehub)...');
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/hirehub', {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`Local Fallback MongoDB Connected: ${fallbackConn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`Local Fallback MongoDB Connection Error: ${fallbackError.message}`);
      }
    }
    console.warn('⚠️ Server will continue running, but MongoDB database operations require a running database connection.');
  }
};

module.exports = connectDB;

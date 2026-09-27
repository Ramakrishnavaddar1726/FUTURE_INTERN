/**
 * MongoDB Database Connection Configuration
 * Connects to MongoDB Atlas or local MongoDB using Mongoose
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

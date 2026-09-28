import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('[Database] No MONGODB_URI provided. Running in high-performance local persistent JSON store mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn('[Database] MongoDB connection failed, falling back to local persistent store:', (error as Error).message);
    isConnected = false;
    return false;
  }
};

export const getIsConnected = (): boolean => isConnected;

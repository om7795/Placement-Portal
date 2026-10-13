import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Retries a few times so the app tolerates
 * a database that is still starting up (common in local dev / docker).
 */
export async function connectDB(uri, { retries = 3, delayMs = 2000 } = {}) {
  if (!uri) throw new Error('MONGO_URI is not set');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`\u2705 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export default connectDB;

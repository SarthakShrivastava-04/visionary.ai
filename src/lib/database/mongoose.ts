import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Type for the global object to include mongoose
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: MongooseConnection | undefined;
    }
  }
}

const cached: MongooseConnection = (global as typeof global & { mongoose?: MongooseConnection }).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'visionary.ai',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

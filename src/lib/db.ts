import mongoose from "mongoose";
import { env } from "./env";

/**
 * Serverless-safe Mongoose connection. Next.js reloads modules between
 * requests in dev and reuses containers on Vercel, so the connection promise
 * is cached on globalThis instead of being re-created per request.
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cache;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
    this.name = "DatabaseNotConfiguredError";
  }
}

export async function connectToDatabase() {
  if (!env.mongoUri) throw new DatabaseNotConfiguredError();
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(env.mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

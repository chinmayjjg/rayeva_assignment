import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

const MONGODB_URI = process.env.MONGODB_URI;


declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  cached = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  global._mongooseConn = cached;
  console.log("MongoDB connected");

  return cached;
}

export default connectDB;
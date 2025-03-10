import mongoose from "mongoose";

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("Can not find DB-URI in .env.file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

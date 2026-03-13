import mongoose from "mongoose";

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  maxPoolSize: 1,
  bufferCommands: false,
};

let cachedConnection: any = null;

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/Test_DB";
  if (!uri) {
    throw new Error("MONGODB_URL is not set in environment variables");
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  try {
    mongoose.set("bufferCommands", false);

    if (uri.includes("127.0.0.1:27017")) {
      console.log("Attempting MongoDB connection - Local Server ...");
    } else {
      console.log("Attempting MongoDB connection - Live ...");
    }

    await mongoose.connect(uri, options);

    console.log("✅ MongoDB connected successfully");

    cachedConnection = mongoose.connection;

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error : ${err.message}`);

      cachedConnection = null;
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
      cachedConnection = null;
    });

    return mongoose.connection;
  } catch (err: any) {
    console.error(`MongoDB connection failed : ${err.message}`);
    cachedConnection = null;
    throw err;
  }
};

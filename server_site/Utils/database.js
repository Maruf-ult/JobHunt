import mongoose from "mongoose";

const dbCon = async () => {
  try {
     await mongoose.connect(process.env.DB_URL, { dbName: "JobPortal" });
    console.log(`Database connected successfully`);
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1); 
  }
};

export default dbCon;
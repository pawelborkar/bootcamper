import { connect, set } from "mongoose";
const connectDB = async () => {
  try {
    set("strictQuery", false);
    const conn = connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;

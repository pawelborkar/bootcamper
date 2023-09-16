import chalk from 'chalk';
import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB connected: ${chalk.yellowBright.bold(conn.connection.host)}`
    );
  } catch (error) {
    console.log(`DB Error: ${chalk.bgRedBright.bold(error)}`);
  }
};

export default connectDB;

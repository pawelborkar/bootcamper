import chalk from 'chalk';
import mongoose from 'mongoose';
const connectDB = async () => {
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(
    `MongoDB connected: ${chalk.yellowBright.bold(conn.connection.host)}`
  );
};

export default connectDB;

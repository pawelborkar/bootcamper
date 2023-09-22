import chalk from 'chalk';
import { connect, set } from 'mongoose';
const connectDB = async () => {
  try {
    set('strictQuery', false);
    const conn = await connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(
      `MongoDB connected: ${chalk.yellowBright.bold(conn.connection.host)}`
    );
  } catch (error) {
    console.log(`DB Error: ${chalk.bgRedBright.bold(error)}`);
    process.exit(1);
  }
};

export default connectDB;

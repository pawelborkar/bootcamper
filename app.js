import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bootcamps from './routes/router.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';

const app = express();
app.use(express.json());

// Load environment variables
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 8000;

// logger for dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to cloud database
connectDB();

// Mounte routers
app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler)

// home route
app.listen(PORT, () => {
  console.log(
    chalk.greenBright(
      `Environment: ${chalk.cyanBright(
        process.env.NODE_ENV
      )}, Port ${chalk.cyanBright(PORT)}`
    )
  );
});

// Handles errors in our application
process.on('unhandledRejection', (err, promise) => {
  console.log(chalk.bold.underline.redBright(`Error: ${err.message}`));

  //Close the server and exit the process
  process.exit(1);
});

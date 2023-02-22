import chalk from 'chalk';
import express from 'express';
import dotenv from 'dotenv';
import bootcamps from './routes/router.js';
// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();
// app.use(express.json())
app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 8000;

// home route

app.listen(PORT, () => {
  console.log(
    chalk.magentaBright(
      `Server running in ${
        process.env.NODE_ENV
      } on http://localhost:${chalk.cyanBright(PORT)}`
    )
  );
});

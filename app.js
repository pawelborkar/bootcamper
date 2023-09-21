import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import YAML from 'yaml';
import fileupload from 'express-fileupload';
import chalk from 'chalk';
import { auth, bootcamps, courses, users } from './routes/index.js';
import connectDB from './db/index.js';
import errorHandler from './middleware/error.js';
// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, './swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

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

// File uploading
app.use(fileupload());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Mounte routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

// Swagger integration
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'none', // keep all the sections collapsed by default
    },
    swaggerUrl: `${process.env.API_URL}`,
    // customCss: `.swagger-ui{background:#3A4454; color:#fff}`,
    customSiteTitle: 'Bootcamper docs',
  })
);

// home route
app.listen(PORT, () => {
  console.log(
    chalk.greenBright(
      `Environment: ${chalk.cyanBright(
        process.env.NODE_ENV
      )}, ${chalk.yellowBright(process.env.PORT)}`
    )
  );
});

// Handles errors in our application
process.on('unhandledRejection', (err, promise) => {
  console.log(chalk.bold.underline.redBright(`Error: ${err.message}`));

  //Close the server and exit the process
  process.exit(1);
});

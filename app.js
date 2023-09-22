import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import YAML from 'yaml';
import fileupload from 'express-fileupload';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import { auth, bootcamps, courses, users, reviews } from './routes/index.js';
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

const API_VERSION = process.env.API_VERSION.toLowerCase();

// logger for dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to cloud database
connectDB();

// File uploading
app.use(fileupload());

// Sanitizes the data
app.use(ExpressMongoSanitize());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Cookie Parser
app.use(cookieParser());

// Set static folder, public in our case
app.use(express.static(path.join(__dirname, 'public')));

// Mounte routers
app.use(`/api/${API_VERSION}/bootcamps`, bootcamps);
app.use(`/api/${API_VERSION}/courses`, courses);
app.use(`/api/${API_VERSION}/auth`, auth);
app.use(`/api/${API_VERSION}/users`, users);
app.use(`/api/${API_VERSION}/reviews`, reviews);

// Error handler middleware
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
    customSiteTitle: 'Bootcamper API Docs',
  })
);

// home route
app.listen(PORT, () => {
  console.log(`Server up and running on PORT: ${PORT}`);
});

// Handles errors in our application
process.on('unhandledRejection', (err, promise) => {
  console.error(err.message);
  //Close the server and exit the process
  process.exit(1);
});

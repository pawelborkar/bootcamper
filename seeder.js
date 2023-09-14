import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoose } from 'mongoose';
import dotenv from 'dotenv';
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';
import chalk from 'chalk';

dotenv.config({ path: './config/config.env' });

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Connect to mongodb database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Read data from the file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// Import data from the file
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log(chalk.bgGreenBright('Data imported successfully...'));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from the file
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log(chalk.bgRedBright('Data deleted successfully...'));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Reading flags from the terminal and calling functions accordingly

if (process.argv[2] === 'import' || process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === 'delete' || process.argv[2] === '-d') {
  deleteData();
}

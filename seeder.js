import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mongoose } from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';
import User from './models/User.js';
import Review from './models/Review.js';

dotenv.config({ path: './config/config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to mongodb database
mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
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
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import all data from the file to the database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log(chalk.bgGreenBright('Data imported successfully...'));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete all the data from the database
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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

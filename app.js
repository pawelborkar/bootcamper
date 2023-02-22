import chalk from "chalk";
import express from "express";
import dotenv from "dotenv";
import router from './routes/index.js'
// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json())
app.use('/api/v1/bootcamps', router)
const PORT = process.env.PORT || 8000;

// home route


app.listen(PORT, () => {
    console.log(
        chalk.magentaBright(
            `Server running in ${process.env.NODE_ENV
                git remote add origin https://github.com/pawelborkar/devcamper.git
                git branch -M master
                git push -u origin master     } on http://localhost:${chalk.cyanBright(PORT)}`
        )
    );
});

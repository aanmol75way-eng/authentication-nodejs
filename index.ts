import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import webRoutes from "./webRoutes";
import { errorMiddleware } from "./common/errorMiddleware";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || "5000";
const DB_URL = process.env.DBNAME;

if (!DB_URL) {
  throw new Error(" DBNAME is not defined in .env");
}

app.use('/web',webRoutes)


app.use(errorMiddleware)
mongoose.connect(DB_URL)
  .then(() => {
    console.log(" Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Database connection failed:", error);
  });

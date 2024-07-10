import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

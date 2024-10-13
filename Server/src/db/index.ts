import mongoose from "mongoose";
import { Mongo_URI } from "#/utils/variables";

mongoose
  .connect(Mongo_URI)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

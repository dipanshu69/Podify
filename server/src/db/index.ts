import { error } from "console";
import mongoose from "mongoose";
import { MONGO_URI } from "#/utils/variables";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((error) => {
    console.log(error);
  });

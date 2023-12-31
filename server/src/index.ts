import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favorite from "./routers/favorite";
import playList from "./routers/playList";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite",  favorite);
app.use("/playlist", playList);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log("Server is Listening on Port " + PORT);
});

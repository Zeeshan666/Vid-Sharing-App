import dotenv from "dotenv"
import express from "express";
import connection from "./db/index.js";


dotenv.config({
    path:'../env'
})
const app = express();

connection().then(() => {
  app.listen(process.env.PORT, (req, res) => {
    console.log(`server started at  ${process.env.PORT}`);
  });
});

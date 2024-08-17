import dotenv from "dotenv";
import app from "./app.js";
import connection from "./db/index.js";

dotenv.config({
  path: "../env",
});

connection().then(() => {
  app.listen(process.env.PORT || 9000, (req, res) => {
    console.log(`server started at  ${process.env.PORT}`);
  });
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "../logger.js";
import morgan from "morgan";
import { morganFormat, customise } from "./constant.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
      
        logger.info(JSON.stringify(customise(message)));
      },
    },
  })
);

import UserRoutes from "./routes/user.js";
app.use("/api/v1/users", UserRoutes);

export default app;

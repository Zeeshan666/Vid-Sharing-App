import express from "express";
import { registerUser, getUser } from "../controllers/user.js";
import Upload from "../middleware/uploadFile.js";

const app = express.Router();

const Images = [
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 3,
  },
];

app.post("/register", Upload.fields(Images), registerUser);
app.get("/getAll", getUser);

export default app;

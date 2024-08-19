import express from "express";
import { registerUser, logout, login } from "../controllers/user.js";
import Upload from "../middleware/uploadFile.js";
import Auth from "../middleware/auth.js";
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
app.post("/login", login);

//secure routes
app.get("/logout", Auth,logout);

export default app;

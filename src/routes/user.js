import express from "express";
import { registerUser, logout, login,getUser} from "../controllers/user.js";
import Upload from "../middleware/uploadFile.js";
import Auth from "../middleware/auth.js";
import Log from "../middleware/User.js";

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
app.get("/getUser",Auth,Log,getUser);


export default app;

import express from "express";
import {
  registerUser,
  logout,
  login,
  getUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getChannelProfile,
  getWatchHistory
} from "../controllers/user.js";

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
app.get("/logout", Auth, logout);
app.get("/getUser", Auth, Log, getUser);

app.post("/change-password", Auth, changeCurrentPassword);
app.get("/current-user", Auth, getCurrentUser);
app.patch("/update-account", Auth, updateAccountDetails);

app.patch("/avatar", Auth, Upload.single("avatar"), updateUserAvatar);
app.patch(
  "/cover-image",
  Auth,
  Upload.single("coverImage"),
  updateUserCoverImage
);

app.get("/channel/:username",Auth,getChannelProfile)

app.get("/history",Auth,getWatchHistory)
export default app;

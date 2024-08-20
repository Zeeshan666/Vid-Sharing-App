import ApiErrors from "../utils/ApiErrors.js";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

const AuthMiddleware = async (req, res, next) => {
  try {
    const token =
      req?.cookie?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiErrors(401, "Invalid request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //decodedToken contain id and email we used while creating JWT
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiErrors(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrors(401, "Invalid Access Token");
  }
};

export default AuthMiddleware;

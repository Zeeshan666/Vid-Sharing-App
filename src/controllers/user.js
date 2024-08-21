import User from "../models/users.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import Cloudnary from "../utils/Cloudnary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (err) {
    throw new ApiError(500, "Something bad happened");
  }
};

const registerUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //avatar image
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await Cloudnary(avatarLocalPath);
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const coverImage = await Cloudnary(coverImageLocalPath);

  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
};

const login = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username) {
    throw new ApiError(400, "email or username is missgin");
  }
  const user = await User.findOne({
    $or: [email, username],
  });

  if (!user) {
    throw new ApiError(400, "email or username is missgin");
  }
  // User.isPasswordCorrect
  const correctPassword = user.isPasswordCorrect(password);

  if (!correctPassword) {
    throw new ApiError(409, "incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "user login successfully"
      )
    );
};

const logout = async (req, res) => {
  const user = req?.user;
  await User.findByIdAndUpdate(req?.user?._id, {
    $set: {
      refreshToken: undefined,
    },
    new: true,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

const getRefreshAcccesToken = async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!getUserToken) {
    throw new ApiError(400, "invalid or expire token");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user,
            accessToken,
            refreshToken,
          },
          "here come the updated refresh token"
        )
      );
  } catch (err) {}
};

const getUser = async (req, res) => {
  res.status(200).json({
    message: "user",
  });
};

const changeCurrentPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid password");
  }
  User.findOneAndUpdate(
    user?._id,
    { $set: { password: newPassword } },
    { new: true }
  );
};
const getCurrentUser = async (req, res) => {
  res.send(200).json(new ApiResponse(200, req?.user, "current user"));
};
const updateAccountDetails = async (req, res) => {
  const { fullName } = req.body;
  if (!fullName) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOneAndUpdate(
    req?.user?._id,
    {
      $set: {
        username,
      },
    },
    { new: true }
  );

  res.send(200).json(new ApiResponse(200, user, "User updated successfully"));
};
const updateUserAvatar = async (req, res) => {
  const avatarLocalPath = req?.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Invalid path");
  }
  const avatar = await Cloudnary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(400, "upload failed");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar,
      },
    },
    { new: true }
  );

  res
    .send(200)
    .json(new ApiResponse(200, user, "Avatar uploaded successfully"));
};
const updateUserCoverImage = async (req, res) => {
  const coverImageLocalPath = req.file[0].path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required");
  }

  const coverImage = await Cloudnary(coverImageLocalPath);
  if (!coverImageLocalPath?.url) {
    throw new ApiError(400, "Cover Image is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
};

export {
  registerUser,
  getUser,
  login,
  logout,
  getRefreshAcccesToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getCurrentUser,
};

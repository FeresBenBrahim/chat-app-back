const userModel = require("../db/models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const asyncHandler = require("express-async-handler");

const {
  BadRequestError,
  UnauthorizedError,
  AccessTokenError,
  TokenExpiredError,
  NotFoundError,
} = require("../core/apiError.js");
const {
  SuccessResponse,
  SuccessMsgDataResponse,
} = require("../core/apiResponse.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: `${process.env.ExpiresIn}`,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // res.cookie("jwt", token, {
  //   expires: new Date(
  //     Date.now() + `${process.env.JWT_COOKIE_EXPIRES_IN}` * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  //   secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  // });

  user.password = undefined;
  return new SuccessResponse({
    user,
    token,
  }).send(res);
};

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("password firstName lastName email");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new BadRequestError("Incorrect email or password");
  }

  createSendToken(user, 200, req, res);
});

exports.signUp = asyncHandler(async (req, res) => {
  try {
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (checkUser) {
      throw new BadRequestError("A user with this email already exists");
    }

    const { firstName, lastName, email, password } =
      req.body;

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      x:password
    });

    const token = signToken(user._id);
    delete user.password;
    delete user.x
    return new SuccessResponse({
      user,
      token,
    }).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];

    }
    if (!token) {
      throw new AccessTokenError("No token provided");
    }
    const decoded = await promisify(jwt.verify)(token, `${process.env.SECRET}`);
    const freshUser = await userModel.findById(decoded.id);

    if (!freshUser) {
      throw new TokenExpiredError("Token expired");
    }
    return new SuccessResponse(freshUser).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AccessTokenError("No token provided");
  }
  try {
    const decoded = await promisify(jwt.verify)(token, `${process.env.SECRET}`);
    const freshUser = await userModel.findById(decoded.id);
    if (!freshUser) {
      throw new UnauthorizedError(
        "The user belonging to this token does no longer exist."
      );
    }

    req.user = freshUser;

    next();
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).select("password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    throw new BadRequestError("Your current password is wrong");
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  const token = signToken(user._id);

  return new SuccessMsgDataResponse(token, "Password updated sucessfully").send(
    res
  );
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { firstName, lastName, tel, work } = req.body;
  const updatedUser = {
    firstName,
    lastName,
    tel,
    work
  }
  const user = await userModel.findByIdAndUpdate(req.user._id, updatedUser);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return new SuccessMsgDataResponse(user, "Profile updated sucessfully").send(
    res
  );
});

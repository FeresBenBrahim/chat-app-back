const { SuccessMsgResponse, SuccessResponse } = require("../core/apiResponse.js");
const userModel = require("../db/models/user");
const asyncHandler = require("express-async-handler");


//Get all users
exports.getAll = asyncHandler(async (req, res) => {
    const users = await userModel.find({ _id: { $ne: req?.user?._id } })
    return new SuccessResponse(users).send(res);
});
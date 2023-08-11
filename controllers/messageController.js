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
const messageModel = require("../db/models/message");
const { Types } = require("mongoose");
const conversationModel = require("../db/models/conversation");


exports.getAll = asyncHandler(async (req, res) => {
    try {
        const { convID } = req.params;
        const messages = await messageModel.find({ conversation: new Types.ObjectId(convID) });
        return new SuccessResponse({
            messages
        }).send(res);
    } catch (err) {
        throw new BadRequestError(err.message);
    }
});

exports.createMsg = asyncHandler(async (req, res) => {
    try {
        if (req.body.conversation) {
            const conversation = await conversationModel.findById(new Types.ObjectId(req.body.conversation));
            if (!conversation) {
                throw new BadRequestError("No conversation found");
            }
            const message = await messageModel.create({ ...req.body, createdBy: req?.user?._id, conversation: req?.body.conversation });
            conversation.lastMessage = message?._id;
            await conversation?.save()
            return new SuccessResponse({
                message
            }).send(res);
        }

        const message = await messageModel.create({ ...req.body, createdBy: req?.user?._id });
        const conversation = await (await conversationModel.create({
            createdBy: req?.user?._id,
            lastMessage: message?._id,
            with: req?.body?.with
        })).populate('lastMessage with createdBy')

        message.conversation = conversation?._id;
        await message.save()

        return new SuccessResponse({
            message,
            conversation
        }).send(res);
    } catch (err) {
        throw new BadRequestError(err.message);
    }
});
exports.update = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageModel.findById(id);
        if (message?.from.toString() === req?.user?._id?.toString()) {
            const message = await messageModel.findByIdAndUpdate(id, req.body);
            return new SuccessResponse({
                message
            }).send(res);
        }
        throw new BadRequestError("Invalid action")

    } catch (err) {
        throw new BadRequestError(err.message);
    }
});

exports.deleteMsg = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageModel.findById(id);
        if (message?.from.toString() === req?.user?._id?.toString()) {
            const message = await messageModel.findByIdAndDelete(id);
            return new SuccessResponse({
                message
            }).send(res);
        }
        throw new BadRequestError("Invalid action")
    } catch (err) {
        throw new BadRequestError(err.message);
    }
});
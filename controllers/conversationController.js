const { Types } = require("mongoose");
const { SuccessMsgResponse, SuccessResponse } = require("../core/apiResponse.js");
const conversationModel = require("../db/models/conversation");
const asyncHandler = require("express-async-handler");

//Get all conversations
exports.getAll = asyncHandler(async (req, res) => {
    const conversations = (await conversationModel.find(
        {
            $or: [{
                createdBy: new Types.ObjectId(req.user?._id),
            }, {
                with: new Types.ObjectId(req.user?._id)
            }]
        }
    ))

    // const { docs, ...meta } = conversations;
    return new SuccessResponse(conversations).send(res);
});
exports.getOneWithUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const conversation = await conversationModel.findOne({
        $or: [
            {
                $and: [{
                    createdBy: new Types.ObjectId(id),
                }, {
                    with: new Types.ObjectId(req?.user?._id)
                }]
            },
            {
                $and: [{
                    createdBy: new Types.ObjectId(req?.user?._id),
                }, {
                    with: new Types.ObjectId(id)
                }]
            },
        ]

    })

    return new SuccessResponse(conversation).send(res);
});

//Get One Conversation
exports.getOne = asyncHandler(async (req, res) => {
    const { conversationID } = req.params;
    const conversation = await conversationModel.findOne({
        createdBy: new Types.ObjectId(req?.user?._id),
        _id: new Types.ObjectId(conversationID)
    });
    if (!conversation) {
        throw new NotFoundError("Conversation not found !");
    }
    return new SuccessResponse(
        "Conversation successfully returned",
        conversation
    ).send(res);
});






//Delete Conversation
exports.deleteOne = asyncHandler(async (req, res) => {
    const { conversationID } = req.params;

    const conversation = await conversationModel.findByIdAndDelete(
        new Types.ObjectId(conversationID)
    );
    //Check conversation exist
    if (!conversation || conversation?.createdBy?.toString() !== req.user?._id?.toString()) {
        throw new NotFoundError("Conversation not found !");
    }

    await conversationModel.findByIdAndDelete(new Types.ObjectId(conversationID));

    return new SuccessMsgResponse("Conversation successfully deleted").send(res);
});



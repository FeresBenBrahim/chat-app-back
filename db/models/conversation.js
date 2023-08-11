const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const conversationSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        with: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);


conversationSchema.plugin(mongoosePaginate)

conversationSchema.pre(/^find/, function (next) {
    this.select("-__v").populate('createdBy lastMessage with');
    next();
});


module.exports = mongoose.model("Conversation", conversationSchema);

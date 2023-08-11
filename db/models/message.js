const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        conversation:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Conversation"
        }
    },
    {
        timestamps: true,
    }
);


messageSchema.plugin(mongoosePaginate)

messageSchema.pre(/^find/, function (next) {
    this.select("-__v").populate('createdBy');
    next();
});


module.exports = mongoose.model("Message", messageSchema);

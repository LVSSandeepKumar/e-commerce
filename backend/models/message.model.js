import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    img: {
        type: String
    }
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;
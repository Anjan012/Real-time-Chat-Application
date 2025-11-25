import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // userId of the sender 
        ref: "Users",
        required:true,
    },
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Users",
        required:false, // it is set to false cause of group chats (channels)
    },
    messageType: { 
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: { // explain 
        type: String,
        required: function () { //  Only required if messageType is "text"
            return this.messageType === "text";
        }
    },
    file: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    timestamp: { // i am aware of this nod need to explain 
        type: Date,
        default: Date.now,
    }

})

const Message = mongoose.model("Messages", messageSchema);

export default Message;  
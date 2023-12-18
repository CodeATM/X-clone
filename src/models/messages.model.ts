import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      senderId: {
        type: String,
        index: true,
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      recipientId: {
        type: String,
        index: true,
      },
      photoUrl: String,
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message

import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  name: {
    type: String,

  },
  description: {
    type: String,

  },
  location: {
    type: String,

  },
  website: {
    type: String,

  },
  photoUrl: {
    type: String,

  },
  headUrl: {
    type: String,

  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPrimium: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  createdTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
  likedTweets: [String],
  retweets: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follow" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follow" }],
  sentMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  receivedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

const Users = mongoose.models.Users || mongoose.model('Users', usersSchema)

export default Users


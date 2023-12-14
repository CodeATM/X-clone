import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followerId: {
    type: String,
    index: true,
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followedId: {
    type: String,
    index: true,
  },
});

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);

export default Follow;

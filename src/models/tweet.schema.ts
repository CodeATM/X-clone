import mongoose from "mongoose";
// import Users from "./users.schema";

const tweetSchema = new mongoose.Schema({

      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      authorId: {
        type: String,
        index: true,
      },
      photoUrl: String,
      likedBy: [String],
      retweetedBy: [String],
      replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      }],
      retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      }],
      isRetweet: {
        type: Boolean,
        default: false,
      },
      retweetOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      },
      retweetOfId: {
        type: String,
        index: true,
      },
      isReply: {
        type: Boolean,
        default: false,
      },
      repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      },
      repliedToId: {
        type: String,
        index: true,
      },
});

const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', tweetSchema)

export default Tweet

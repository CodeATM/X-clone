import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import Tweet from '@/models/tweet.schema'
import User from '@/models/users.schema'

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB();


  try {

    const user = await User.findOne({ username: username })
    let identifier = user.id
    const tweets = await Tweet.find({
      'author': identifier,
      isReply: false,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        select: "id username name isPremium photoUrl description",
      })
      .populate({
        path: "likedBy",
        select: "id username name isPremium photoUrl description",
      })
      .populate({
        path: "retweetedBy",
        select: "id username name isPremium photoUrl description",
      })
      .populate({
        path: "retweetOf",
        select: "id author authorId createdAt likedBy retweetedBy photoUrl text isReply repliedTo replies",
        populate: {
          path: "author",
          select: "id username name isPremium photoUrl description",
        },
      })
      .populate({
        path: "replies",
        select: "id",
      })
      .populate({
        path: "repliedTo",
        select: "id author",
        populate: {
          path: "author",
          select: "id username name isPremium photoUrl description",
        },
      });

    return NextResponse.json({ success: true, tweets });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

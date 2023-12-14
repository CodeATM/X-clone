import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import Tweet from "@/models/tweet.model";

export default async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB();
  console.log('route')

  try {
    const tweets = await Tweet.find({
      'author.username': username,
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

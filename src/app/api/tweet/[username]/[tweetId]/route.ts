import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import Tweet from '@/models/tweet.schema'
export async function GET(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
  try {

    await connectToDB()
    const tweet = await Tweet.findOne({ _id: tweetId })
      .populate({
        path: "author",
        select: "id username name isPremium photoUrl description",
      })
      .populate({
        path: "likedBy",
        select: "id username name description photoUrl isPremium followers",
        populate: {
          path: "followers",
          select: "id username name isPremium photoUrl description",
        },
      })
      .populate({
        path: "retweetedBy",
        select: "id username name description photoUrl isPremium followers",
        populate: {
          path: "followers",
          select: "id username name isPremium photoUrl description",
        },
      })
      .populate({
        path: "retweetOf",
        select: "id author authorId createdAt likedBy retweetedBy photoUrl text isReply replies",
        populate: {
          path: "author",
          select: "id username name isPremium photoUrl description",
        },
      })
      .populate({
        path: "repliedTo",
        select: "id author",
        populate: {
          path: "author",
          select: "id username name isPremium photoUrl description",
        },
      })
      .populate({
        path: "replies",
        select: "authorId",
      });

    return NextResponse.json({ success: true, tweet });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Tweet from '@/models/tweet.schema'
import { connectToDB } from "@/utilities/mongoose";
import User from '@/models/users.schema'

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB()
  try {
    const user = await User.findOne({ username: username })
    let identifier = user.id
    const tweets = await Tweet.find({
      'author': identifier,
      isReply: true,
    })
      .populate({
        path: "author likedBy retweetedBy retweetOf.replies",
        select: "id username name isPremium photoUrl description",
      })
      .populate({
        path: "retweetedBy.retweetOf.replies",
        select: "id authorId",
      })
      .populate({
        path: "replies repliedTo",
        select: "id author",
        populate: {
          path: "author",
          select: "id username name isPremium photoUrl description",
        },
      })
      .sort({ createdAt: "desc" })
      .lean()
      .exec();

    return NextResponse.json({ success: true, tweets });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Tweet from "@/models/tweet.model";
import { connectToDB } from "@/utilities/mongoose";


export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB()
  try {
    const tweets = await Tweet.find({
      "author.username": username,
      isRetweet: false,
      photoUrl: { $ne: null, $not: { $size: 0 } }, // not null and not an empty string
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

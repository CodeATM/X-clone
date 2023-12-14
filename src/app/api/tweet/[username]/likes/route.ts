import { NextRequest, NextResponse } from "next/server";
import Tweet from "@/models/tweet.model";
import Users from "@/models/users.schema";
import { connectToDB } from "@/utilities/mongoose";

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB()
  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    const tweets = await Tweet.find({
      "likedBy.id": user.id,
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

import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Tweet from "@/models/tweet.model";
import { verifyJwtToken } from "@/utilities/auth";
import { connectToDB } from "@/utilities/mongoose";

export async function GET(request: NextRequest) {
  await connectToDB()
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    const tweets = await Tweet.find({
      $or: [
        { authorId: verifiedToken.id },
        { "author.followers": { $elemMatch: { id: verifiedToken.id } } },
      ],
      isReply: false,
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

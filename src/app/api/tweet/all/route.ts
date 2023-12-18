import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";

import Tweet from '@/models/tweet.schema'
export async function GET(request: NextRequest) {
  await connectToDB()
  let page = request.nextUrl.searchParams.get("page");
  const limit = 10;

  if (!page) {
    page = "1";
  }

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  let nextPage = parsedPage + 1;

  try {
    const tweets = await Tweet.find({
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
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean()
      .exec();

    const totalTweets = await Tweet.countDocuments({ isReply: false });
    const lastPage = Math.ceil(totalTweets / parsedLimit);


    return NextResponse.json({ success: true, tweets, nextPage, lastPage });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });

  }
}

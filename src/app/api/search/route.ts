import { NextRequest, NextResponse } from "next/server";
import Tweet from '@/models/tweet.schema'
import { connectToDB } from "@/utilities/mongoose";

export async function GET(request: NextRequest) {
  connectToDB()
  const query = request.nextUrl.searchParams.get("q");

  if (!query) return NextResponse.json({ success: false, message: "Missing query." });

  try {
    const tweets = await Tweet.find({
      $in: [
        {
          text: {
            $regex: query,
            $options: "i",
          },
        },
        {
          author: {
            $in: [
              {
                name: {
                  $regex: query,
                  $options: "i",
                },
              },
              {
                username: {
                  $regex: query,
                  $options: "i",
                },
              },
            ],
          },
        },
      ],
    })
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
          select: "id username name isPremium description",
        },
      });

    return NextResponse.json({ success: true, tweets });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });
  }
}

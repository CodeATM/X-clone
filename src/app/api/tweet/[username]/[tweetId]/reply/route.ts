import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import Notification from "@/models/notification.model";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Tweet from '@/models/tweet.schema'
import { verifyJwtToken } from "@/utilities/auth";

export async function GET(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
  await connectToDB()
  console.log('hello')
  try {
    const tweets = await Tweet.find({
      isReply: true,
      repliedTo: tweetId,
    })
      .populate({
        path: "author",
        select: "id username name description isPremium photoUrl",
      })
      .populate({
        path: "likedBy",
        select: "id username name description isPremium photoUrl",
        populate: {
          path: "followers",
          select: "id username name photoUrl",
        },
      })
      .populate({
        path: "repliedTo",
        select: "id",
        populate: {
          path: "author",
          select: "id username name isPremium description",
        },
      })
      .populate({
        path: "replies",
        select: "authorId",
      })
      .sort({
        createdAt: "desc",
      })
      .exec();

    return NextResponse.json({ success: true, tweets });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}




export async function POST(
  request: NextRequest,
  { params: { tweetId, username } }: { params: { tweetId: string; username: string } }
) {
  console.log('i got here')
  const { authorId, text, photoUrl } = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  const secret = process.env.CREATION_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({
      success: false,
      message: "Secret key not found.",
    });
  }

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  if (verifiedToken.id !== authorId)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    const newTweet = new Tweet({
      isReply: true,
      text,
      photoUrl,
      author: authorId,
      repliedTo: tweetId,
    });

    await newTweet.save();

    // if (username !== verifiedToken.username) {
    //   // Create a notification
    //   const notification = new Notification({
    //     sender: {
    //       username: verifiedToken.username,
    //       name: verifiedToken.name,
    //       photoUrl: verifiedToken.photoUrl,
    //     },
    //     content: {
    //       id: tweetId,
    //     },
    //   });

    //   await notification.save();
    // }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });
  }
}

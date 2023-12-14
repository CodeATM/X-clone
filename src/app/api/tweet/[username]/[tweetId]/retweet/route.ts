import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Tweet from "@/models/tweet.model";
import { verifyJwtToken } from "@/utilities/auth";
import Notification from "@/models/notification.model";

export async function POST(
  request: NextRequest,
  { params: { tweetId, username } }: { params: { tweetId: string; username: string } }
) {
  await connectToDB()
  const tokenOwnerId = await request.json();

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

  if (verifiedToken.id !== tokenOwnerId)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    // Update the tweet to connect the retweeter
    await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $addToSet: {
          retweetedBy: tokenOwnerId,
        },
      },
      { new: true }
    );

    // Create a new tweet representing the retweet
    const newRetweet = new Tweet({
      isRetweet: true,
      text: "",
      author: tokenOwnerId,
      retweetOf: tweetId,
    });

    await newRetweet.save();

    if (username !== verifiedToken.username) {
      // Create a notification
      const notification = new Notification({
        sender: {
          username: verifiedToken.username,
          name: verifiedToken.name,
          photoUrl: verifiedToken.photoUrl,
        },
        content: {
          id: tweetId,
        },
      });

      await notification.save();
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

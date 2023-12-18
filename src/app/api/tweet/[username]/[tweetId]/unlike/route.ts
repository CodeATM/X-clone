import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utilities/mongoose";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Tweet from '@/models/tweet.schema'
import { verifyJwtToken } from "@/utilities/auth";

export async function POST(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
  await connectToDB()
  const tokenOwnerId = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  if (verifiedToken.id !== tokenOwnerId)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    // Update the tweet to disconnect the liker
    await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $pull: {
          likedBy: tokenOwnerId,
        },
      },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Tweet from '@/models/tweet.schema'
import { verifyJwtToken } from "@/utilities/auth";
import { connectToDB } from "@/utilities/mongoose";

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
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return NextResponse.json({ success: false, message: "Tweet not found." });
    }

    if (tweet.author.toString() !== verifiedToken.id) {
      return NextResponse.json({ success: false, message: "You are not the owner of this tweet." });
    }

    await tweet.remove();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { connectToDB } from "@/utilities/mongoose";

import Tweet from "@/models/tweet.model";
import { verifyJwtToken } from "@/utilities/auth";
import { UserTypes } from "@/types/userTypes";


export async function POST(request: NextRequest) {
  await connectToDB()
  console.log('we dey here')

  const { authorId, text, photoUrl } = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    
  try {
    const newTweet = await Tweet.create({
      text,
      photoUrl,
      author: authorId,
    });

    return NextResponse.json({ success: true, tweet: newTweet });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

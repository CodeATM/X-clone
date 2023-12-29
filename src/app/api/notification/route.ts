import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import Notification from "@/models/notification.model";
import { verifyJwtToken } from "@/utilities/auth";
import User from '@/models/users.schema'
import { connectToDB } from "@/utilities/mongoose";
export async function GET(request: NextRequest) {
  console.log('i got here')
  await connectToDB()
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (!verifiedToken) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  try {
    const user = await User.findById(verifiedToken.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    const notifications = await Notification.find({
      userId: user._id,
    })
      .populate({
        path: "user",
        select: "username name photoUrl",
      })
      .sort({ createdAt: "desc" });

    return NextResponse.json({ success: true, notifications });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

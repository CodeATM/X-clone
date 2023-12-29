import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { connectToDB } from "@/utilities/mongoose";

import Notification from "@/models/notification.model";
import { verifyJwtToken } from "@/utilities/auth";
import Users from '@/models/users.schema'

export async function GET(request: NextRequest) {
  await connectToDB()
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (!verifiedToken) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  try {
    // Assuming you have a User model to connect to
    const user = await Users.findById(verifiedToken.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    await Notification.updateMany(
      {
        userId: user._id,
      },
      {
        isRead: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

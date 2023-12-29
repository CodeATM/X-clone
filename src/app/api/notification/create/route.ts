import { NextRequest, NextResponse } from "next/server";
import Users from '@/models/users.schema'
import Notification from "@/models/notification.model";
import { connectToDB } from "@/utilities/mongoose";

export async function POST(request: NextRequest) {
  await connectToDB()
  const { recipient, type, secret, notificationContent } = await request.json();

  if (secret !== process.env.SECRET_KEY) {
    return NextResponse.json({ success: false, error: "Invalid secret." });
  }

  try {
    // Assuming you have a User model to connect to
    const user = await Users.findOne({ username: recipient });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." });
    }

    await Notification.create({
      user: user._id,
      type: type,
      content: JSON.stringify(notificationContent),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });
  }
}

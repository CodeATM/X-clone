import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Message from "@/models/messages.model";
import { verifyJwtToken } from "@/utilities/auth";
import Notification from "@/models/notification.model";
import User from '@/models/users.schema'
import { shouldCreateNotification } from "@/utilities/Misc/shouldCreateNotification";
import { connectToDB } from "@/utilities/mongoose";

export async function POST(request: NextRequest) {
  await connectToDB()
  const { recipient, sender, text, photoUrl } = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  const secret = process.env.CREATION_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({
      success: false,
      message: "Secret key not found.",
    });
  }

  if (!verifiedToken) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  if (verifiedToken.username !== sender) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  try {
    // Assuming you have a User model to connect to
    const isRecipient = await User.findOne({
      username: recipient,
    });
    const isSender = await User.findOne({
      username: sender,
    });

    if (!isRecipient) {
      return NextResponse.json({ success: false, message: "Recipient does not exist." });
    }

    await Message.create({
      text,
      photoUrl,
      sender: isSender._id,
      recipient: isRecipient._id,
    });

    if (recipient !== verifiedToken.username && (await shouldCreateNotification(verifiedToken.username, recipient))) {
      const notificationContent = {
        sender: {
          username: verifiedToken.username,
          name: verifiedToken.name,
          photoUrl: verifiedToken.photoUrl,
        },
        content: null,
      };

      await Notification.create(recipient, "message", secret, notificationContent);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ success: false, error });
  }
}

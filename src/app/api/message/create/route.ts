import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Message from "@/models/messages.model";
import { verifyJwtToken } from "@/utilities/auth";
import Users from "@/models/users.schema";

export async function POST(request: NextRequest) {
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
    const isRecipient = await Users.findOne({
      username: recipient,
    });

    if (!isRecipient) {
      return NextResponse.json({ success: false, message: "Recipient does not exist." });
    }

    await Message.create({
      text,
      photoUrl,
      sender: sender,
      recipient: isRecipient._id,
    });

    // if (recipient !== verifiedToken.username && (await shouldCreateNotification(verifiedToken.username, recipient))) {
    //   const notificationContent = {
    //     sender: {
    //       username: verifiedToken.username,
    //       name: verifiedToken.name,
    //       photoUrl: verifiedToken.photoUrl,
    //     },
    //     content: null,
    //   };

    //   await Notification.create(recipient, "message", secret, notificationContent);
    // }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}
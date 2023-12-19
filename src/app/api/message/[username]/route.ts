import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import Message from "@/models/messages.model";
import { verifyJwtToken } from "@/utilities/auth";
import Users from "@/models/users.schema";
import { UserTypes } from "@/types/userTypes";

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (!verifiedToken) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  if (verifiedToken.username !== username) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  try {
    // Assuming you have a User model to connect to
    const user = await Users.findOne({ username });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id },
        { recipient: user._id },
      ],
    })
      .populate({
        path: "sender",
        select: "name username photoUrl isPremium",
      })
      .populate({
        path: "recipient",
        select: "name username photoUrl isPremium",
      })
      .sort({ createdAt: "asc" });

      const conversations: any = {};

    messages.forEach((message) => {
      const sender = message.sender.username;
      const recipient = message.recipient.username;
      const conversationKey = [sender, recipient].sort().join("-");

      if (!conversations.hasOwnProperty(conversationKey)) {
        conversations[conversationKey] = {
          participants: [sender, recipient],
          messages: [],
        };
      }

      conversations[conversationKey].messages.push(message);
    });

    const formattedConversations = Object.values(conversations);

    formattedConversations.sort((a: any, b: any) => {
      const lastMessageA = a.messages[a.messages.length - 1];
      const lastMessageB = b.messages[b.messages.length - 1];

      if (lastMessageA.createdAt > lastMessageB.createdAt) {
        return -1;
      } else if (lastMessageA.createdAt < lastMessageB.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });

    return NextResponse.json({ success: true, formattedConversations });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

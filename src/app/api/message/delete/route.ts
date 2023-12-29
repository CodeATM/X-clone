import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { UserTypes } from "@/types/userTypes";
import Message from "@/models/messages.model";
import { verifyJwtToken } from "@/utilities/auth";
import { connectToDB } from "@/utilities/mongoose";

export async function POST(request: NextRequest) {
  connectToDB()
  const { tokenOwnerId, participants }: { tokenOwnerId: string; participants: string[] } = await request.json();

  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (!verifiedToken) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  if (verifiedToken.id !== JSON.parse(tokenOwnerId)) {
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });
  }

  try {
    await Message.deleteMany({
      $or: [
        {
          $and: [
            { "sender.username": participants[0] },
            { "recipient.username": participants[1] },
          ],
        },
        {
          $and: [
            { "sender.username": participants[1] },
            { "recipient.username": participants[0] },
          ],
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

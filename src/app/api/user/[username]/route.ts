import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Users from "@/models/users.schema";
import { connectToDB } from "@/utilities/mongoose";
export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB();
  try {
    const user = await Users.findOne({ username: username })
      .select({
        id: true,
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        location: true,
        website: true,
        isPremium: true,
        photoUrl: true,
        headerUrl: true,
        followers: {
          id: true,
          name: true,
          username: true,
          description: true,
          isPremium: true,
          photoUrl: true,
          followers: { id: true },
          following: { id: true },
        },
        following: {
          id: true,
          name: true,
          username: true,
          description: true,
          isPremium: true,
          photoUrl: true,
          followers: { id: true },
          following: { id: true },
        },
      })
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found.",
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

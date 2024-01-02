import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from '@/models/users.schema'
import { verifyJwtToken } from "@/utilities/auth";
import { UserTypes } from "@/types/userTypes";
import { connectToDB } from "@/utilities/mongoose";


export async function POST(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB();
  const tokenOwnerId = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  if (verifiedToken.id !== tokenOwnerId)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $pull: { followers: tokenOwnerId },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User not found.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}
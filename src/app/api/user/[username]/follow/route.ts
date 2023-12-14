import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Users from "@/models/users.schema";
import { verifyJwtToken } from "@/utilities/auth";
// import { createNotification } from "@/utilities/fetch";
import { UserTypes } from "@/types/userTypes";
import { connectToDB } from "@/utilities/mongoose";

export async function POST(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  await connectToDB();
  const tokenOwnerId = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  const secret = process.env.CREATION_SECRET_KEY;

  // if (!secret) {
  //   return NextResponse.json({
  //     success: false,
  //     message: "Secret key not found.",
  //   });
  // }

  if (!verifiedToken)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  if (verifiedToken.id !== tokenOwnerId)
    return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { username: username },
      {
        $addToSet: { followers: tokenOwnerId },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User not found.",
      });
    }

    // const notificationContent = {
    //   sender: {
    //     username: verifiedToken.username,
    //     name: verifiedToken.name,
    //     photoUrl: verifiedToken.photoUrl,
    //   },
    //   content: null,
    // };

    // await createNotification(username, "follow", secret, notificationContent);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

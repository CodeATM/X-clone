import { NextRequest, NextResponse } from "next/server";
import Users from "@/models/users.schema";
import { verifyJwtToken } from "@/utilities/auth";
import { UserTypes } from "@/types/userTypes";
import {cookies} from 'next/headers'


export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token)
  const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

  if (!verifiedToken) return NextResponse.json({ success: false, message: "You are not logged in." });

  const username = verifiedToken.username as string;

  const usersCount = await Users.countDocuments({
    isPremium: true,
    $nor: [
      { username: username },
      { "followers.username": username },
    ],
  });

  let skip = Math.floor(Math.random() * (usersCount - 3));

  if (skip < 0) skip = 0;

  try {
    const users = await Users.find({
      $nor: [
        { photoUrl: null },
        { username: username },
        { "followers.username": username },
      ],
      photoUrl: { $ne: "" },
    })
      .select({
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        location: true,
        website: true,
        photoUrl: true,
        isPremium: true,
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
      .skip(skip)
      .limit(3)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({ success: true, users });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

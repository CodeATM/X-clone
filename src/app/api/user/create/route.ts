import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import Users from "@/models/users.schema";
import { hashPassword } from "@/utilities/bcrypt";
import { getJwtSecretKey } from "@/utilities/auth";
import { connectToDB } from "@/utilities/mongoose";

export async function POST(request: NextRequest) {
  // Connect to the MongoDB database
  await connectToDB();

  const userInfo = await request.json();
  console.log("here", userInfo.password);
  const hashedPassword = await hashPassword(userInfo.password);

  console.log(hashedPassword, "password");

  try {
    // Check if the username already exists
    const userExist = await Users.findOne({ username: userInfo.username });

    if (userExist) {
      return NextResponse.json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create a new user using Mongoose
    const newUser = await Users.create({
      ...userInfo,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = await new SignJWT({
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      description: newUser.description,
      location: newUser.location,
      website: newUser.website,
      isPremium: newUser.isPremium,
      createdAt: newUser.createdAt,
      photoUrl: newUser.photoUrl,
      headerUrl: newUser.headerUrl,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(getJwtSecretKey());

    // Prepare the response
    const response = NextResponse.json({
      success: true,
    });

    // Set the token as a cookie in the response
    response.cookies.set({
      name: "token",
      value: token,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}

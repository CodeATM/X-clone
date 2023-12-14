import { NextRequest, NextResponse } from "next/server";
import {SignJWT} from 'jose'
import { connectToDB } from "@/utilities/mongoose";
import Users from '@/models/users.schema'
import { comparePassword } from "@/utilities/bcrypt";
import { getJwtSecretKey } from "@/utilities/auth";

export async function POST(request: NextRequest) {
    await connectToDB();
    const {username, password} = await request.json()

    try {
        const user = await Users.findOne({username})

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Username or pssword incorrect'
            })
        }

        const isPasswwordCorrect = await comparePassword(password, user.password)

        if (!isPasswwordCorrect) {
            return NextResponse.json({
                success: false,
                message: 'Username or pssword incorrect'
            }) 
        }
        const token = await new SignJWT({
            id: user.id,
            username: user.username,
            name: user.name,
            description: user.description,
            location: user.location,
            website: user.website,
            isPremium: user.isPremium,
            createdAt: user.createdAt,
            photoUrl: user.photoUrl,
            headerUrl: user.headerUrl,
        })
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(getJwtSecretKey());

        const response = NextResponse.json({
            success: true,
        });

        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        return NextResponse.json({success: false})
    }
}
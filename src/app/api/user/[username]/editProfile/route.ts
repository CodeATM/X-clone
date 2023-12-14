import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import {SignJWT} from 'jose'
import Users from "@/models/users.schema";
import { connectToDB } from "@/utilities/mongoose";
import { getJwtSecretKey, verifyJwtToken } from "@/utilities/auth";
import { UserTypes } from "@/types/userTypes";

export async function POST(request: NextRequest, {params: {username}}: {params: {
    username: string
}}){
console.log("route here")
    await connectToDB()

    const data = await request.json()

    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    const verifyToken: UserTypes = token && (await verifyJwtToken(token))

    if (!verifyToken) {
        return NextResponse.json({success: false, message: 'You dont have the authority to be here'})
    }

    if(verifyToken.username !== username) {
        return NextResponse.json({success: false, message:"You don't have the authoriy to be here"})
    }

    try {
        const user = await Users.findOneAndUpdate(
            { username: username },
            data,
            { new: true, runValidators: true }
          );

        const newToken = await new SignJWT({
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
        }).setProtectedHeader({
            alg: 'HS256'
        }).setIssuedAt().setExpirationTime('1d').sign(getJwtSecretKey())

        const response = NextResponse.json({
            success: true,
        })

        response.cookies.set({
            name: 'token',
            value: newToken,
            path: '/'
        })
        return response
    } catch (error: unknown) {
        return NextResponse.json({success:false, error})
    }
}

import {NextRequest, NextResponse} from 'next/server'

import Users from "@/models/users.schema";
import { connectToDB } from "@/utilities/mongoose";

export async function GET(request: NextRequest) {
    await connectToDB();
    const query = request.nextUrl.searchParams.get('q')

    if (!query) return NextResponse.json({success: false, message: 'Missing query'});

    try {
        const user = await Users.findOne({ username: query});

        if(!user) return NextResponse.json({sucess:false, message: 'user not found'})
        return NextResponse.json({success: true})
    } catch (error: unknown) {
        return NextResponse.json({success: false, error})
    }
}
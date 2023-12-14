import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDB } from "@/utilities/mongoose";
import { UserTypes } from "@/types/userTypes";
import Tweet from "@/models/tweet.model";
import { verifyJwtToken } from "@/utilities/auth";

export async function POST(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
    const tokenOwnerId = await request.json();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const verifiedToken: UserTypes = token && (await verifyJwtToken(token));

    if (!verifiedToken)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    if (verifiedToken.id !== tokenOwnerId)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        // Fetch the original tweet with the retweets
        const originalTweet = await prisma.tweet.findFirst({
            where: {
                id: tweetId,
            },
            include: {
                retweets: true,
            },
        });

        // Disconnect the retweet relationship
        await prisma.tweet.update({
            where: {
                id: tweetId,
            },
            data: {
                retweetedBy: {
                    disconnect: {
                        id: tokenOwnerId,
                    },
                },
            },
        });

        // Find the retweetId using the originalTweet
        const retweetId = originalTweet?.retweets.find((retweet: any) => retweet.authorId === tokenOwnerId)?.id;

        // Delete the retweet using the found retweetId
        await prisma.tweet.delete({
            where: {
                id: retweetId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}

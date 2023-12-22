"use client";

import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import Tweets from '@/Components/tweet/Tweets'
import { getRelatedTweets } from "@/utilities/fetch";
import CircularLoading from '@/Components/mics/CircularLoading'
import NothingToShow from "@/Components/mics/NothingToShow";
import NewTweet from '@/Components/tweet/NewTweet';
import { AuthContext } from "../layout";

export default function HomePage() {
    const { token, isPending } = useContext(AuthContext);

    const { isLoading, data } = useQuery({
        queryKey: ["tweets", "home"],
        queryFn: () => getRelatedTweets(),
    });

    if (isPending || isLoading) return <CircularLoading />;

    return (
        <main className="relative w-full" >
            <h1 className="py-8 px-4 font-bold text-[1.25rem] border-b-[1px] border-borderColor sticky z-50 top-0 bg-backgroundPrimary opacity-90">Home</h1>
            {token && <NewTweet token={token} />}
            {data && data.tweets.length === 0 && <NothingToShow />}
            <Tweets tweets={data.tweets} />
        </main>
    );
}
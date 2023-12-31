"use client";

import { useQuery } from "@tanstack/react-query";

import Tweets from "@/Components/tweet/Tweets";
import { getUserMedia } from "@/utilities/fetch";
import CircularLoading from "@/Components/mics/CircularLoading";
import NotFound from "@/app/not-found";
import NothingToShow from "@/Components/mics/NothingToShow";

export default function Page({ params: { username } }: { params: { username: string } }) {
    const { isLoading, data } = useQuery({
        queryKey: ["tweets", username, "media"],
        queryFn: () => getUserMedia(username),
    });

    if (!isLoading && !data.tweets) return NotFound();

    if (data && data.tweets.length === 0) return NothingToShow();

    return <>{isLoading ? <CircularLoading /> : <Tweets tweets={data.tweets} />}</>;
}

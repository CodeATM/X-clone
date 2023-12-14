"use client";

import { useQuery } from "@tanstack/react-query";

// import Tweets from "@/components/tweet/Tweets";
import { getUserTweets } from "@/utilities/fetch";
// import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/app/not-found";
// import NothingToShow from "@/components/misc/NothingToShow";

export default function UserTweets({ params: { username } }: { params: { username: string } }) {
    const { isLoading, data } = useQuery({
        queryKey: ["tweets", username],
        queryFn: () => getUserTweets(username),
    });

    // if (!isLoading && !data.tweets) return <NotFound/> ;

    // if (data && data.tweets.length === 0) return <h1>Nothing to show</h1> ;

    return <>{isLoading ? <h1>loading</h1> : <h1>tweet</h1> }</>;
}

import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getUserTweets } from '@/utilities/fetch'


export default function TweetArrayLength({ username }: { username: string }) {
    const { isFetched, data } = useQuery({
        queryKey: ["tweets", username],
        queryFn: () => getUserTweets(username),
    });

    return <span className="text-[0.93rem] text-twitterMuted">{isFetched ? data.tweets?.length : "0"} Tweets</span>;
}
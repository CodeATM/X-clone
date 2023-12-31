"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { search } from "@/utilities/fetch";
import CircularLoading from "@/Components/mics/CircularLoading";
import NothingToShow from "@/Components/mics/NothingToShow";
import Tweets from "@/Components/tweet/Tweets";
import BackToArrow from "@/Components/mics/BackToArrow";

export default function SearchPage() {
    const searchParams = useSearchParams();

    const searchQuery = searchParams?.get("q");
    const encodedSearchQuery = encodeURI(searchQuery || "");

    const queryKey = ["search", encodedSearchQuery];

    const { data, isLoading, isFetched } = useQuery({
        queryKey: queryKey,
        queryFn: () => search(encodedSearchQuery),
    });

    return (
        <main>
            <BackToArrow title="Search results" url="/explore" />
            {isFetched && data && (!data.tweets || data.tweets.length === 0) && <NothingToShow />}
            {isLoading ? <CircularLoading /> : <Tweets tweets={data.tweets} />}
        </main>
    );
}
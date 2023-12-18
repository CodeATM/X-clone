"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewTweet from "@/Components/tweet/NewTweet";
import Tweets from "@/Components/tweet/Tweets";
import { AuthContext } from "../layout";
import { getAllTweets } from "@/utilities/fetch";
import CircularLoading from '@/Components/mics/CircularLoading'

const Page = () => {
  const { token, isPending } = useContext(AuthContext);

  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["tweets"],
    async ({ pageParam = 1 }) => getAllTweets(pageParam),
    {
      getNextPageParam: (lastResponse) => {
        if (lastResponse.nextPage > lastResponse.lastPage) return false;
        return lastResponse.nextPage;
      },
    }
  );

  const tweetsResponse = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          nextPage: page.nextPage,
          tweets: [...prev.tweets, ...page.tweets],
        };
      }),
    [data]
  );

  if (isPending) return <CircularLoading/>;
  return (
    <main className="relative w-full">
      <h1 className="py-8 px-4 font-bold text-[1.25rem] border-b-[1px] border-borderColor sticky z-50 top-0 bg-backgroundPrimary opacity-90">
        Explore
      </h1>
      {token && <NewTweet token={token} />}
      {isLoading ? (
        <CircularLoading/>
      ) : (
        <InfiniteScroll
          dataLength={tweetsResponse ? tweetsResponse.tweets.length : 0}
          next={() => fetchNextPage()}
          hasMore={!!hasNextPage}
          loader={<h1>Loading....</h1>}
        >
          <Tweets tweets={tweetsResponse && tweetsResponse.tweets} />
        </InfiniteScroll>
      )}
    </main>
  );
};

export default Page;

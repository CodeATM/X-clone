import { UserTypes } from "./userTypes";

export type TweetProps = {
    _id: string;
    text: string;
    createdAt: Date;
    author: UserTypes;
    authorId: string;
    photoUrl: string;
    likedBy: UserTypes[];
    retweets: TweetProps[];
    replies: TweetProps[];
    isRetweet: boolean;
    retweetedBy: UserTypes[];
    retweetedById: string;
    retweetOf: TweetProps;
    isReply: boolean;
    repliedTo: TweetProps;
    repliedToId: string;
};

export type TweetsArray = {
    tweets: TweetProps[];
};

export type TweetResponse = {
    success: boolean;
    tweet: TweetProps;
};

export type TweetOptionsProps = {
    tweetId: string;
    tweetAuthor: string;
};

export type NewTweetProps = {
    token: UserTypes;
    handleSubmit?: () => void;
}
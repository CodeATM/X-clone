import { Avatar, Popover, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiFillTwitterCircle } from "react-icons/ai";

import { TweetProps } from "@/types/TweetProps";
import { formatDate, formatDateExtended } from "@/utilities/date";
import { shimmer } from "@/utilities/Misc/shimmer";
import Reply from "./Reply";
import Retweet from "./Retweet";
import Like from "./Like";
import Share from "./Share";
import PreviewDialog from "@/Components/Modals/PreviewModal";
import { getFullURL } from "@/utilities/getFullURL";
import { AuthContext } from "@/app/(twitter)/layout";
import RetweetIcon from "../../Components/mics/RetweetIcon";
import ProfileCard from "@/Components/user/ProfileCard";

export default function Tweet({ tweet }: { tweet: TweetProps }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredProfile, setHoveredProfile] = useState("");

    const { token } = useContext(AuthContext);
    const router = useRouter();

    // console.log(tweet.id)

    let displayedTweet = tweet;

    // if (tweet.isRetweet) {
    //     displayedTweet = tweet.retweetOf;
    // }

    // console.log(tweet._id)

    console.log(displayedTweet)

    const handleTweetClick = () => {
        router.push(`/${displayedTweet.author.username}/tweets/${displayedTweet._id}`);
    };
    const handlePropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePreviewClick();
    };
    const handlePreviewClick = () => {
        setIsPreviewOpen(true);
    };
    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };
    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>, type: "default" | "mention" | "retweet" = "default") => {
        if (type === "mention") {
            setHoveredProfile(displayedTweet.repliedTo.author.username);
        }
        if (type === "retweet") {
            setHoveredProfile(tweet.author.username);
        }
        if (type === "default") {
            setHoveredProfile(displayedTweet.author.username);
        }
        setAnchorEl(e.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <motion.div
            onClick={handleTweetClick}
            className={`border-b-[1px] border-borderColor p-4 flex items-start gap-2 overflow-hidden transition-color ease-in-out hover:bg-hover cursor-pointer ${tweet.isRetweet && "px-4 pt-8 pb-4 relative"} ${displayedTweet.isReply && "reply"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Link
                onClick={handlePropagation}
                className="mb-auto"
                href={displayedTweet.author ? `/${displayedTweet.author.username}` : ''}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Avatar
                    className="avatar"
                    sx={{ width: 50, height: 50 }}
                    alt=""
                    src={displayedTweet.author.photoUrl ? getFullURL(displayedTweet.author.photoUrl) : "/assets/egg.jpg"}
                />
            </Link>
            <div className="flex flex-col gap-2 w-[100%]">
                <section className="flex items-center">
                    <Link
                        onClick={handlePropagation}
                        className="flex items-center gap-[0.35rem] hover:underline"
                        href={`/${displayedTweet.author.username}`}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    >
                        <span className="font-bold text-[0.93rem] flex items-center hover:underline">
                            {displayedTweet.author.name !== "" ? displayedTweet.author.name : displayedTweet.author.username}
                            {displayedTweet.author.isPremium && (
                                <span className=" align-top text-twitterBlue ml-[2px] inline-flex relative after:absolute after:top-[100%] after:left-1/2 after:-translate-x-1/2 after:py-1 after:px-2 after:bg-twitterBlue after:text-constWhite after:text-[0.75rem] after:whitespace-nowrap after:font-medium rounded-lg after:opacity-0 after:transition duration-75 ease-in-out after:[content: attr(data-blue)]" data-blue="Verified Blue after:hover:opacity-1">
                                    <AiFillTwitterCircle />
                                </span>
                            )}
                        </span>
                        <span className="text-[0.75rem] opacity-75 cursor-pointer whitespace-nowrap">@{displayedTweet.author.username}</span>
                    </Link>
                    <Tooltip title={formatDateExtended(displayedTweet.createdAt)} placement="top">
                        <span className="text-twitterMuted block">
                            <span className="p-[0.3rem] text-twitterMuted">·</span>
                            {formatDate(displayedTweet.createdAt)}
                        </span>
                    </Tooltip>
                </section>
                <div className=" whitespace-pre-line text-[0.85rem] leading-normal ">
                    {displayedTweet.isReply && (
                        <Link
                            onClick={handlePropagation}
                            href={`/${displayedTweet.repliedTo.author.username}`}
                            className="absolute top-6 font-light text-twitterMuted text-[0.9rem] tracking-[0.5px]"
                        >
                            <span
                                className="font-normal text-twitterDarkBlue hover:underline"
                                onMouseEnter={(e) => handlePopoverOpen(e, "mention")}
                                onMouseLeave={handlePopoverClose}
                            >
                                @{displayedTweet.repliedTo.author.username}
                            </span>
                        </Link>
                    )}{" "}
                    {displayedTweet.text}
                </div>
                {displayedTweet.photoUrl && (
                    <div onClick={handlePropagation}>
                        <div className="border-[1px] border-borderColor overflow-hiddenmt-2 w-fit ">
                            <Image
                                onClick={handleImageClick}
                                src={getFullURL(displayedTweet.photoUrl)}
                                alt="tweet image"
                                placeholder="blur"
                                blurDataURL={shimmer(500, 500)}
                                height={500}
                                width={500}
                                className="object-cover block cursor-pointer max-w-full "
                            />
                        </div>
                        <PreviewDialog
                            open={isPreviewOpen}
                            handlePreviewClose={handlePreviewClose}
                            url={displayedTweet.photoUrl}
                        />
                    </div>
                )}
                <div onClick={handlePropagation} className="max-w-[400px] flex justify-between mt-2 translate-[-6px, -6px]">
                    <Reply tweet={displayedTweet} />
                    <Retweet tweetId={displayedTweet._id} tweetAuthor={displayedTweet.author.username} />
                    <Like tweetId={displayedTweet._id} tweetAuthor={displayedTweet.author.username} />
                    <Share
                        tweetUrl={`https://${window.location.hostname}/${displayedTweet.author.username}/tweets/${displayedTweet._id}`}
                    />
                </div>
            </div>
            {tweet.isRetweet &&
                (token?.username === tweet.author.username ? (
                    <Link onClick={handlePropagation} href={`/${token?.username}`} className="absolute top-2 left-[3.1rem] text-[0.75rem] font-bold text-twitterMuted flex items-center gap-4 hover:underline">
                        <RetweetIcon /> You retweeted.
                    </Link>
                ) : (
                    <Link
                        onClick={handlePropagation}
                        href={`/${tweet.author.username}`}
                        className="absolute top-2 left-[3.1rem] text-[0.75rem] font-bold text-twitterMuted flex items-center gap-4 hover:underline"
                        onMouseEnter={(e) => handlePopoverOpen(e, "retweet")}
                        onMouseLeave={handlePopoverClose}
                    >
                        <RetweetIcon /> {`${tweet.author.name ? tweet.author.name : tweet.author.username} retweeted.`}
                    </Link>
                ))}
            <Popover
                sx={{
                    pointerEvents: "none",
                }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <ProfileCard username={hoveredProfile} token={token} />
            </Popover>
        </motion.div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegComment, FaRegEnvelope } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { RiChatFollowUpLine } from "react-icons/ri";
import { Avatar, Popover } from "@mui/material";

import { NotificationProps } from "@/types/NotificationProps";
import { getFullURL } from "@/utilities/getFullURL";
import RetweetIcon from "./RetweetIcon";
import ProfileCard from "../user/ProfileCard";
import { UserTypes } from "@/types/userTypes";

export default function Notification({ notification, token }: { notification: NotificationProps; token: UserTypes }) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const content = JSON.parse(notification.content);

    const tweetUrl = `/${notification.user.username}/tweets/${content?.content?.id}`;
    const profileUrl = `/${content?.sender.username}`;

    const popoverJSX = (
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
            <ProfileCard username={content?.sender.username} token={token} />
        </Popover>
    );

    const sharedJSX = (
        <div className="notification-sender hover:bg-hover">
            <Link
                href={profileUrl}
                className="inline-block"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Avatar
                    sx={{ width: 33, height: 33 }}
                    alt=""
                    className="object-cover"
                    src={content?.sender.photoUrl ? getFullURL(content?.sender.photoUrl) : "/assets/egg.jpg"}
                />
                <div className="flex flex-col gap-[0.33rem]">
                    <h1 className="text-twitterBlack font-medium" >
                        {content?.sender.name !== "" ? content?.sender.name : content?.sender.username}{" "}
                        <span className="text-twitterMuted">(@{content?.sender.username})</span>
                    </h1>
                </div>
            </Link>
            {popoverJSX}
        </div>
    );

    if (notification.type === "message") {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterPurple">
                    <FaRegEnvelope />
                </div>
                <div>
                    {sharedJSX} <span className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>Sent you a direct message.</span>{" "}
                    <Link className={`text-twitterBlue hover:underline ${!notification.isRead ? "font-bold text-twitterBlack" : ""}`} href="/messages">
                        Check it out!
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "follow") {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterPink">
                    <RiChatFollowUpLine />
                </div>
                <div>
                    {sharedJSX}{" "}
                    <span className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>
                        Started following you. Stay connected and discover their updates!
                    </span>
                </div>
            </div>
        );
    } else if (notification.type === "like") {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterRed">
                    <FaHeart />
                </div>
                <div>
                    {sharedJSX} <span className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>Liked your</span>{" "}
                    <Link className={`text-twitterBlue hover:underline ${!notification.isRead ? "font-bold text-twitterBlack" : ""}`} href={tweetUrl}>
                        tweet.
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "reply") {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterDarkBlue">
                    <FaRegComment />
                </div>
                <div>
                    {sharedJSX} <span className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>Replied to your</span>{" "}
                    <Link className={`text-twitterBlue hover:underline ${!notification.isRead ? "font-bold text-twitterBlack" : ""}`} href={tweetUrl}>
                        tweet.
                    </Link>
                </div>
            </div>
        );
    } else if (notification.type === "retweet") {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterRetweet">
                    <RetweetIcon />
                </div>
                <div>
                    {sharedJSX} <span className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>Retweeted your</span>{" "}
                    <Link className={`text-twitterBlue hover:underline ${!notification.isRead ? "font-bold text-twitterBlack" : ""}`} href={tweetUrl}>
                        tweet.
                    </Link>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-4 overflow-hidden transition-color ease-in-out h-[65px] border-b-[1px] border-borderColor text-twitterMuted grid grid-cols-[50px 1fr]  items-center gap-4 leading-[1.2]">
                <div className="flex justify-center items-center text-[1.5rem] text-twitterOrange">
                    <GiPartyPopper />
                </div>
                <div className={!notification.isRead ? "font-bold text-twitterBlack" : ""}>
                    Welcome to the Twitter! <br />
                    Start exploring and sharing your thoughts with the world.
                </div>
            </div>
        );
    }
}

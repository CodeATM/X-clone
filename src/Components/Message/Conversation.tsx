import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Menu, MenuItem, Popover, Tooltip } from "@mui/material";
import { AiFillTwitterCircle } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getFullURL } from "@/utilities/getFullURL";
import { formatDate, formatDateExtended } from "@/utilities/date";
import ProfileCard from "../user/ProfileCard";
import { ConversationProps } from "@/types/Messagesprops";
import CircularLoading from "../mics/CircularLoading";
import { deleteConversation } from "@/utilities/fetch";

export default function Conversation({ conversation, token, handleConversations }: ConversationProps) {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (tokenOwnerId: string) => deleteConversation(conversation.participants, tokenOwnerId),
        onSuccess: () => {
            setIsConfirmationOpen(false);
            setIsDeleting(false);
            queryClient.invalidateQueries(["messages", token.username]);
        },
        onError: (error) => console.log(error),
    });

    const messagedUsername = conversation.participants.find((user: string) => user !== token.username);

    const { name, username, photoUrl, isPremium } =
        conversation.messages[conversation.messages.length - 1].recipient.username === messagedUsername
            ? conversation.messages[conversation.messages.length - 1].recipient
            : conversation.messages[conversation.messages.length - 1].sender;

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const handleConversationClick = () => {
        handleConversations(true, conversation.messages, messagedUsername);
    };
    const handleConfirmationClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorMenuEl(null);
        setIsConfirmationOpen(true);
    };
    const handleThreeDotsClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorMenuEl(e.currentTarget);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePopoverClose();
        setIsDeleting(true);
        const jsonId = JSON.stringify(token.id);
        mutation.mutate(jsonId);
    };

    return (
        <div className="p-4 flex items-center gap-4 overflow-hidden transition-colors ease-in-out h-[65px] cursor-pointer border-b-[1px] border-borderColor hover:bg-hover" onClick={handleConversationClick}>
            <Link href={`/${username}`} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                <Avatar
                    className="transition-filter ease-in-out duration-200 hover:filter"
                    sx={{ width: 50, height: 50 }}
                    alt=""
                    src={photoUrl ? getFullURL(photoUrl) : "/assets/egg.jpg"}
                />
            </Link>
            <div className="flex flex-col h-[45px] gap-[0.2rem]">
                <section className="flex items-center">
                    <Link
                        className="flex items-center gap-[0.35rem] hover:underline"
                        href={`/${username}`}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    >
                        <span className="font-bold text-[15px] flex items-center hover:underline">
                            {name !== "" ? name : username}
                            {isPremium && (
                                <span className="blue-tick" data-blue="Verified Blue">
                                    <AiFillTwitterCircle />
                                </span>
                            )}
                        </span>
                        <span className="text-[0.75rem] opacity-75 cursor-pointer whitespace-nowrap text-twitterMuted">@{username}</span>
                    </Link>
                    <Tooltip title={formatDateExtended(lastMessage.createdAt)} placement="top">
                        <span className="text-[0.75rem] opacity-75 cursor-pointer whitespace-nowrap text-twitterMuted">
                            <span className="p-[0.3rem] font-black">·</span>
                            {formatDate(lastMessage.createdAt)}
                        </span>
                    </Tooltip>
                </section>
                <div className="whitespace-nowrap overflow-hidden text-ellipsis leading-[1.5] max-w-[200px] text-twitterMuted ">{lastMessage.text}</div>
            </div>
            <>
                <button className="ml-auto text-[1.2rem] hover:bg-twitterLightGray" onClick={handleThreeDotsClick}>
                    <RxDotsHorizontal />
                </button>
                <Menu anchorEl={anchorMenuEl} onClose={() => setAnchorMenuEl(null)} open={Boolean(anchorMenuEl)}>
                    <MenuItem onClick={handleConfirmationClick} className="border-none bg-inherit text-twitterRed font-bold">
                        Delete
                    </MenuItem>
                </Menu>
            </>
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
                <ProfileCard username={username} token={token} />
            </Popover>
            {isConfirmationOpen && (
                <div className="z-[9999] fixed top-0 left-0 w-full h-full bg-backgroundPrimary flex justify-center items-center">
                    <dialog open className="border-[1px] border-borderColor bg-backgroundPrimary text-twitterBlack rounded-[1rem] shadow-[0 25px 50px -12px rgba(0, 0, 0, 0.25)] w-[clamp(150px, 33vw, 250px)] p-6 flex flex-col gap-4">
                        <h1 className="text-[1.2rem]">Delete Conversation?</h1>
                        <p className="text-sm text-twitterMuted font-normal">
                            Are you sure you want to clear this conversation? If you proceed, your messages will be removed,
                            as well as the messages in the recipient&apos;s message box.
                        </p>
                        {isDeleting ? (
                            <CircularLoading />
                        ) : (
                            <>
                                <button className="btn bg-twitterRed text-constWhite hover:bg-twitterDarkRed hover:text-constWhite" onClick={handleDelete}>
                                    Delete
                                </button>
                                <button
                                    className="btn text-twitterBlack bg-backgroundPrimary border-[1px] border-twitterLightGray hover:bg-hover hover:text-twitterBlack"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsConfirmationOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </dialog>
                </div>
            )}
        </div>
    );
}

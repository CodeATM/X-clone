import { useState } from "react";
import { Tooltip } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

import { UserTypes } from "@/types/userTypes";
import Link from "next/link";

export default function CompleteProfileReminder({ token }: { token: UserTypes }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen &&
                (!token.name ||
                    !token.description ||
                    !token.photoUrl ||
                    !token.location ||
                    !token.website ||
                    !token.headerUrl) && (
                    <div className="border-[1px] border-borderColor rounded-[1rem] bg-twitterWhite p-4 flex flex-col relative gap-4">
                        <h1 className="font-extrabold text-[1.2rem]">
                            Complete your profile
                            {/* <button className="btn-close icon-hoverable right-sidebar-close" onClick={handleClose}>
                                <AiOutlineClose />
                            </button> */}
                        </h1>
                        <p className="text-[0.8rem] leading-[1.25]">
                            Complete your Twitter profile to make the most of your presence! Here are a few things you have
                            not filled out yet:
                        </p>
                        <ol>
                            {!token.name && (
                                <Tooltip
                                    title="Don't forget to add your name to your profile! Let others know who you are and personalize your Twitter experience. Take a moment to fill in your name now and make meaningful connections."
                                    placement="top"
                                >
                                    <li className="">Add your name:</li>
                                </Tooltip>
                            )}
                            {!token.description && (
                                <Tooltip
                                    title="Share a brief description about yourself or what you tweet about."
                                    placement="top"
                                >
                                    <li>Write a bio:</li>
                                </Tooltip>
                            )}
                            {!token.photoUrl && (
                                <Tooltip title="Let others see the face behind your tweets." placement="top">
                                    <li>Add a profile picture:</li>
                                </Tooltip>
                            )}
                            {!token.headerUrl && (
                                <Tooltip title="Make your profile visually appealing and unique." placement="top">
                                    <li>Customize your header image:</li>
                                </Tooltip>
                            )}
                            {!token.location && (
                                <Tooltip
                                    title="Let others know where you're tweeting from and connect with users in your area. Take a moment to update your location and make your Twitter experience more engaging."
                                    placement="top"
                                >
                                    <li>Your location</li>
                                </Tooltip>
                            )}
                            {!token.website && (
                                <Tooltip
                                    title="Showcase your personal blog, portfolio, or any other online presence."
                                    placement="top"
                                >
                                    <li>Include your website:</li>
                                </Tooltip>
                            )}
                        </ol>
                        <Link href={`/${token.username}/edit`} className="btn text-twitterWhite bg-twitterBlack hover:bg-twitterLightBlack hover:text-twitterWhite text-center">
                            Edit Profile
                        </Link>
                    </div>
                )}
        </>
    );
}

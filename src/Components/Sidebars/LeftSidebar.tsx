"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { FaHome, FaBell, FaEnvelope, FaUser, FaCog, FaHashtag, FaEllipsisH, FaTwitter } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";  
import Image from 'next/image'
import NewTweetDialog from "@/Components/Modals/NewTweetDialog"
import LogOutDialog from "@/Components/Modals/LogoutDialog";
import { logout } from "@/utilities/fetch";
import { AuthContext } from "@/app/(twitter)/layout";
import { getFullURL } from "@/utilities/getFullURL";
import UnreadNotificationsBadge from '@/utilities/Misc/UnreadNotificationBadge'

export default function LeftSidebar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isNewTweetOpen, setIsNewTweetOpen] = useState(false);
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { token } = useContext(AuthContext);

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleAnchorClose = () => {
        setAnchorEl(null);
    };
    const handleNewTweetClick = () => {
        setIsNewTweetOpen(true);
    };
    const handleNewTweetClose = () => {
        setIsNewTweetOpen(false);
    };
    const handleLogOutClick = () => {
        handleAnchorClose();
        setIsLogOutOpen(true);
    };
    const handleLogOutClose = () => {
        setIsLogOutOpen(false);
    };

    return (
        <>
            <aside className="left-sidebar justify-start">
                <div className="fixed gap-8 flex flex-col items-start">
                    <Link href="/explore" className="p-4 w-fit">
                        <Image src='/X-icon.png' alt='logo' width={20} height={20}/>
                    </Link>
                    <nav>
                        <ul className="gap-4 flex flex-col pr-5 justify-start text-start items-start" >
                            {token && (
                                <li className= 'm-auto'>
                                    <Link href="/home">
                                        <div className={`text-[20px] p-0 lg:p-3 rounded-[5rem] inline-flex transition-colors ease-in-out text-twitterLightBlack hover:bg-hover items-center ${pathname.startsWith("/home") ? "font-black" : ""}`}>
                                            <FaHome className='p-0 mr-3 text-twitterMuted'/> <span className="hidden lg:block">Home</span>
                                        </div>
                                    </Link>
                                </li>
                            )}
                            <li className= 'm-auto '>
                                <Link href="/explore">
                                    <div className={`text-[20px] p-0 lg:p-3 rounded-[5rem] inline-flex transition-colors ease-in-out text-twitterLightBlack hover:bg-hover items-center ${pathname.startsWith("/explore") ? "font-black" : ""}`}>
                                        <FaHashtag className='p-0 mr-3 text-twitterMuted'/> <span className="hidden lg:block">Explore</span>
                                    </div>
                                </Link>
                            </li>
                            {token && (
                                <>
                                    <li className= 'm-auto '>
                                        <Link href="/notifications">
                                            <div
                                                className={`text-[20px] p-0 lg:p-3 rounded-[5rem] inline-flex transition-colors ease-in-out text-twitterLightBlack hover:bg-hover items-center ${
                                                    pathname.startsWith("/notifications") ? "font-black" : ""
                                                }`}
                                            >
                                                <div className="relative">
                                                    <FaBell className='p-0 mr-3 text-twitterMuted'/> <UnreadNotificationsBadge />
                                                </div>
                                                <span className="hidden lg:block">Notifications</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className= 'm-auto'>
                                        <Link href="/messages">
                                            <div className={`text-[20px] p-0 lg:p-3 rounded-[5rem] inline-flex transition-colors 0ease-in-out text-twitterLightBlack hover:bg-hover items-center ${pathname.startsWith("/messages") ? "font-black" : ""}`}>
                                                <FaEnvelope className='p-0 mr-3 text-twitterMuted'/> <span className="hidden lg:block">Messages</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className= 'm-auto'>
                                        <Link href={`/${token.username}`}>
                                            <div
                                                className={`text-[20px] p-0 lg:p-3 rounded-[5rem] inline-flex transition-colors ease-in-out text-twitterLightBlack hover:bg-hover items-center ${
                                                    pathname.startsWith(`/${token.username}`) ? "font-black" : ""
                                                }`}
                                            >
                                                <FaUser className='p-0 mr-3 text-twitterMuted'/> <span className="hidden lg:block">Profile</span>
                                            </div>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                    {token && (
                        <>
                            <button onClick={handleNewTweetClick} className="btn text-[.75rem] -ml-[0.1rem] p-2 flex w-full justify-center  rounded-[5rem]">
                                Tweet
                            </button>
                            <button onClick={handleAnchorClick} className="max-w-[45px] scale-75 p-1 fixed bottom-6 flex gap-2 items-center xl:py-2 xl:px-3 border-none rounded-[5rem] cursor-pointer bg-twitterWhite xl:max-w-[250px] overflow-hidden hover:bg-hover">
                                <div>
                                    <Avatar
                                        className="avatar"
                                        alt=""
                                        src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                                    />
                                </div>
                                <div>
                                    <div className="font-bold pb-0.25rem flex text-left text-twitterBlack">
                                        {token.name !== "" ? token.name : token.username}
                                        {token.isPremium && (
                                            <span className="blue-tick" data-blue="Verified Blue">
                                                <AiFillTwitterCircle />
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[0.93rem] text-twitterMuted text-left ">@{token.username}</div>
                                </div>
                                <div className="pr-2 text-twitterBlack">
                                    <FaEllipsisH />
                                </div>
                            </button>
                            <Menu
                                anchorEl={anchorEl}
                                onClose={handleAnchorClose}
                                open={Boolean(anchorEl)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}`}>Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}/edit`}>Edit Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href="/settings">Settings</Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogOutClick}>Log Out</MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </aside>
            {token && (
                <>
                    <NewTweetDialog open={isNewTweetOpen} handleNewTweetClose={handleNewTweetClose} token={token} />
                    <LogOutDialog
                        open={isLogOutOpen}
                        handleLogOutClose={handleLogOutClose}
                        logout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
                </>
            )}
        </>
    );
}

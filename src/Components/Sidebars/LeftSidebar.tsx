"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaUser,
  FaCog,
  FaHashtag,
  FaEllipsisH,
} from "react-icons/fa";

import { AiFillTwitterCircle } from "react-icons/ai";
import { AuthContext } from "@/app/(twitter)/layout";

type Props = {};

function LeftSidebar({}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isNewTweetOpen, setIsNewTweetOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { token } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {};

  return (
    <>
      <div className="fixed gap-8 flex flex-col min-w-[10px] xl:min-w-[190px] 2xl:min-w-[230px] relative lg:ml-auto pl-4 border-borderColor border-r-[1px] h-screen top-0 left-0">
        <Link href="/explore" className="pt-4 w-fit">
          <Image
            src="/x-icon.png"
            width={20}
            height={20}
            alt=""
            className="P-2"
          />
        </Link>

        <nav>
          <ul className="gap-4">
            {token && (
              <li className="m-auto">
                <Link href="/home">
                  <div
                    className={`text-[20px] p-0 mb-5 lg:p-3 lg:rounded-[3rem] lg:inline-flex lg:transition ease-in-out text-twitterLightBlack lg:hover:bg-hover items-center ${
                      pathname.startsWith("/home") ? "font-[900]" : ""
                    }`}
                  >
                    <FaHome className="lg:mr-4 lg:text-twitterMuted" />{" "}
                    <span className="hidden lg:block">Home</span>
                  </div>
                </Link>
              </li>
            )}
            <li className="m-auto">
              <Link href="/home">
                <div
                  className={`text-[20px] p-0 mb-5 lg:p-3 lg:rounded-[3rem] lg:inline-flex lg:transition ease-in-out text-twitterLightBlack lg:hover:bg-hover items-center ${
                    pathname.startsWith("/explore") ? "font-[900]" : ""
                  }`}
                >
                  <FaHashtag className="mr-4" />{" "}
                  <span className="hidden lg:block">Explore</span>
                </div>
              </Link>
            </li>
            {token && (
              <>
                <li className="m-auto">
                  <Link href="/notification">
                    <div
                      className={`text-[20px] p-0 mb-5 lg:p-3 lg:rounded-[3rem] lg:inline-flex lg:transition ease-in-out text-twitterLightBlack lg:hover:bg-hover items-center ${
                        pathname.startsWith("/notification") ? "active" : ""
                      }`}
                    >
                      <FaBell className="mr-4" />{" "}
                      <span className="hidden lg:block">Notification</span>
                    </div>
                  </Link>
                </li>{" "}
                <li className="m-auto">
                  <Link href="/messages">
                    <div
                      className={`text-[20px] p-0 mb-5 lg:p-3 lg:rounded-[3rem] lg:inline-flex lg:transition ease-in-out text-twitterLightBlack lg:hover:bg-hover items-center ${
                        pathname.startsWith("/messages") ? "font-[900]" : ""
                      }`}
                    >
                      <FaEnvelope className="mr-4 text-twitterMuted" />{" "}
                      <span className="hidden lg:block">Messages</span>
                    </div>
                  </Link>
                </li>{" "}
                <li className="m-auto">
                  <Link href={`/${token.username}`}>
                    <div
                      className={`text-[20px] p-0 mb-5 lg:p-3 lg:rounded-[3rem] lg:inline-flex lg:transition ease-in-out text-twitterLightBlack lg:hover:bg-hover items-center ${
                        pathname.startsWith(`/${token.username}`)
                          ? "font-[900]"
                          : ""
                      }`}
                    >
                      <FaUser className="mr-4" />{" "}
                      <span className="hidden lg:block">Profile</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* {token && (
            <>
              <button className="btn btn-tweet text-[0.75rem] -ml-[0.1] p-2 lg:flex lg:w-[100%] lg:p-3 lg:rounded-[3rem] lg:justify-center">
                Tweet
              </button>
              <button className="max-w-[45px] scale-[.75] p-1 fixed lg:max-w-[250px] lg:py-2 lg:px-3 rounded-[3rem] bottom-6 flex items-center gap-2 border-none cursor-pointer bg-twitterWhite overflow-hidden hover:bg-hover ">
                <div className="">
                  <Image src="/x-icon.png" alt="" className="avatar" width={20} height={20} />
                </div>
                <div className="">
                  <div className="font-bold pb-1 flex text-left text-twitterBlack">
                    <div className="text-left">@{token.username}</div>
                    {token.isPremium && (
                      <span className="blue-tick" data-blue="verifiedBlue">
                        <AiFillTwitterCircle />
                      </span>
                    )}
                  </div>
                </div>
                <div className="pr-2 text-twitterBlack">
                  <FaEllipsisH />
                </div>
              </button>
            </>
          )} */}
      </div>
    </>
  );
}

export default LeftSidebar;

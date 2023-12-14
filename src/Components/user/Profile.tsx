"use client";

import { Avatar, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { UserTypes } from "@/types/userTypes";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { FaArrowLeft, FaRegEnvelope } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { AiFillTwitterCircle, AiOutlineLink } from "react-icons/ai";
import { formatDateForProfile } from "@/utilities/date";
import { AuthContext } from "@/app/(twitter)/layout";
import TweetArrayLength from "../tweet/TweetArrayLength";
import Follow from "./Follow";
import { getFullURL } from "@/utilities/getFullURL";
import { SnackbarProps } from "@/types/snackbarProps";
import CustomSnackbar from "../mics/CustomSnackbar";
import NewMessages from "../Modals/NewMessages";
import User from "./User";
import PreviewDialog from "../Modals/PreviewModal";

const Profile = ({ profile }: { profile: UserTypes }) => {
  const [dialogType, setDialogType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [preview, setPreview] = useState({ open: false, url: "" });
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const { token } = useContext(AuthContext);
  const pathname = usePathname();

  const handleOpenModal = (type: string) => {
    if (!token) {
      alert("no token");
    }

    if (type === "following" && profile.following.length === 0) return;
    if (type === "followers" && profile.followers.length === 0) return;

    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogType("");
    setIsDialogOpen(false);
  };

  const handleImageClick = (e: any) => {
    const clickedElement = e.target;
    if (clickedElement.alt === "profile-header") {
      handlePreviewClick(
        profile.headerUrl ? profile.headerUrl : "/assets/header.jpg"
      );
    }
    if (clickedElement.alt === "profile-photo") {
      handlePreviewClick(
        profile.photoUrl ? profile.photoUrl : "/assets/egg.jpg"
      );
    }
  };

  const handlePreviewClick = (url: string) => {
    setPreview({ open: true, url });
  };
  const handlePreviewClose = () => {
    setPreview({ open: false, url: "" });
  };

  const handleNewMessageClick = () => {
    if (!token) {
      return setSnackbar({
        message: "You need to login first to message someone.",
        severity: "info",
        open: true,
      });
    }
    setIsNewMessageOpen(true);
  };

  const isFollowingTokenOwner = () => {
    if (profile.following.length === 0 || !token) return false;
    const isFollowing = profile.following.some((user) => user.id === token.id);
    return isFollowing;
  };

  return (
    <>
      <div className="p-4 flex items-center gap-1 border-b-[1px] border-borderColor sticky z-50 top-0 bg-backgroundPrimary opacity-90">
        <Link className="text-[1rem]" href="/explore">
          <FaArrowLeft />
        </Link>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-xl">{profile.username}</span>
          {/* <TweetArrayLength username={profile.username} /> */}
        </div>
      </div>
      <div className="profile">
        <div className="w-[100%] h-52 relative">
          <Image
            onClick={handleImageClick}
            className="div-link"
            alt="profile-header"
            src={"/header.jpg"}
            fill
          />
          <div className="absolute -bottom-[70px] left-6 border-[4px] border-twitterWhite rounded-[5rem] object-cover">
            <Avatar
              className="cursor-pointer transition-all 0.2s ease-in-out hover:brightness-75"
              onClick={handleImageClick}
              sx={{ width: 125, height: 125 }}
              alt="profile-photo"
              src={
                profile.photoUrl ? getFullURL(profile.photoUrl) : "/X-icon.png"
              }
            />
          </div>
        </div>
        <div className="mt-28 sm:mt-20 pl-5 flex flex-col gap-4 relative">
          <div className="flex flex-col gap-1">
            <h1 className="text-[1.2rem] font-[900]">
              {profile.name !== "" ? profile.name : profile.username}
              {profile.isPremium && (
                <span className="blue-tick" data-blue="Verified Blue">
                  <AiFillTwitterCircle />
                </span>
              )}
            </h1>
            <div className="text-muted">
              @{profile.username}{" "}
              {isFollowingTokenOwner() && (
                <span className="text-[0.7rem] font-medium bg-twitterWhite text-twitterBlack py-[0.1rem] px-2">
                  Follows you
                </span>
              )}
            </div>
          </div>
          {profile.description && (
            <div className="text-[0.93rem] leading-normal overflow-auto">
              {profile.description}
            </div>
          )}
          <div className="flex gap-4 text-muted">
            {profile.location && (
              <div className="flex items-center gap-2">
                <GoLocation /> {profile.location}
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <AiOutlineLink />{" "}
                <a
                  className="mention"
                  href={"https://" + profile.website}
                  target="_blank"
                >
                  {profile.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BiCalendarCheck /> Joined{" "}
              {formatDateForProfile(profile.createdAt)}
            </div>
          </div>
          <div className="flex gap-4">
            <div
              onClick={() => handleOpenModal("following")}
              className="cursor-pointer hover: under"
            >
              <span className="font-[900]">{profile.following.length}</span>{" "}
              <span className="hover:undeline">Following</span>
            </div>
            <div
              onClick={() => handleOpenModal("followers")}
              className="cursor-pointer hover: under"
            >
              <span className="font-[900]">{profile.followers.length}</span>{" "}
              <span className="hover:undeline">Followers</span>
            </div>
          </div>
          {token?.username === profile.username ? (
            <Link
              href={`/${profile.username}/edit`}
              className="btn btn-white absolute right-4 -top-16 font-semibold text-[0.93rem]"
            >
              Edit profile
            </Link>
          ) : (
            <div className="absolute right-4 -top-16 font-semibold text-[0.93rem] flex gap-2">
              <button
                className="btn btn-white icon-hoverable new-message"
                onClick={handleNewMessageClick}
              >
                <FaRegEnvelope />
              </button>
              <Follow profile={profile} />
            </div>
          )}
        </div>
      </div>
      <nav className="flex justify-around mt-7 border-b-[1px] border-borderColor ">
        <Link
          className={`flex justify-center flex-1 pt-4 px-8 pb-1 transition-colors duration-75 text-twitterMuted font-medium hover:bg-hover ${
            pathname === `/${profile.username}`
              ? "border-b-[3px] font-semibold color-twitterBlack pr-1 pb-3 "
              : ""
          }`}
          href={`/${profile.username}`}
        >
          <span>Tweets</span>
        </Link>
        <Link
          className={`flex justify-center flex-1 pt-4 px-8 pb-1 transition-colors duration-75 text-twitterMuted font-medium hover:bg-hover ${
            pathname === `/${profile.username}/replies`
              ? "border-b-[3px] font-semibold color-twitterBlack pr-1 pb-3 "
              : ""
          }`}
          href={`/${profile.username}/replies`}
        >
          <span>Replies</span>
        </Link>
        <Link
          className={`flex justify-center flex-1 pt-4 px-8 pb-1 transition-colors duration-75 text-twitterMuted font-medium hover:bg-hover ${
            pathname === `/${profile.username}/media`
              ? "border-b-[3px] font-semibold color-twitterBlack pr-1 pb-3 "
              : ""
          }`}
          href={`/${profile.username}/media`}
        >
          <span>Media</span>
        </Link>
        <Link
          className={`flex justify-center flex-1 pt-4 px-8 pb-1 transition-colors duration-75 text-twitterMuted font-medium hover:bg-hover ${
            pathname === `/${profile.username}/likes`
              ? "border-b-[3px] font-semibold color-twitterBlack pr-1 pb-3 "
              : ""
          }`}
          href={`/${profile.username}/likes`}
        >
          <span>Likes</span>
        </Link>
      </nav>
      {isDialogOpen && (
        <Dialog
          className="dialog"
          open={isDialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle className="title">
            {dialogType === "following"
              ? "Following"
              : dialogType === "followers"
              ? "Followers"
              : ""}
          </DialogTitle>
          <DialogContent sx={{ paddingX: 0 }}>
            <div className="user-list">
              {dialogType === "following"
                ? profile.following.map((user: UserTypes) => (
                    <div className="user-wrapper" key={"following" + user.id}>
                      <User user={user} />
                    </div>
                  ))
                : profile.followers.map((user: UserTypes) => (
                    <div className="user-wrapper" key={"followers" + user.id}>
                      <User user={user} />
                    </div>
                  ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <PreviewDialog
        open={preview.open}
        handlePreviewClose={handlePreviewClose}
        url={preview.url}
      />
      {token && isNewMessageOpen && (
        <NewMessages
          handleNewMessageClose={() => setIsNewMessageOpen(false)}
          open={isNewMessageOpen}
          token={token}
          recipient={profile.username}
        />
      )}
    </>
  );
};

export default Profile;

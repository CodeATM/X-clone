import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RxDotsHorizontal } from "react-icons/rx";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { AiFillTwitterCircle } from "react-icons/ai";
import { TweetProps } from "@/types/TweetProps";
import { formatDateExtended } from "@/utilities/date";
import Reply from "./Reply";
import Retweet from "./Retweet";
import Like from "./Like";
import Share from "./Share";
import Counters from "./Counter";
import { getFullURL } from "@/utilities/getFullURL";
import { VerifiedToken } from "@/types/TokenTypes";
import { deleteTweet } from "@/utilities/fetch";
import PreviewDialog from "../Modals/PreviewModal";
import { shimmer } from "@/utilities/Misc/shimmer";
import NewReply from "./NewReply";
import Replies from "./Replies";
import CustomSnackbar from "../mics/CustomSnackbar";
import { SnackbarProps } from "@/types/snackbarProps";
import CircularLoading from "../mics/CircularLoading";
import { sleepFunction } from "@/utilities/Misc/sleep";

export default function SingleTweet({
  tweet,
  token,
}: {
  tweet: TweetProps;
  token: VerifiedToken;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (jsonId: string) =>
      deleteTweet(tweet._id, tweet.authorId, jsonId),
    onSuccess: async () => {
      setIsConfirmationOpen(false);
      setIsDeleting(false);
      setSnackbar({
        message:
          "Tweet deleted successfully. Redirecting to the profile page...",
        severity: "success",
        open: true,
      });
      await sleepFunction(); // for waiting snackbar to acknowledge delete for better user experience
      queryClient.invalidateQueries(["tweets", tweet.author.username]);
      router.replace(`/${tweet.author.username}`);
    },
    onError: (error) => console.log(error),
  });

  const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleAnchorClose = () => {
    setAnchorEl(null);
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
  const handleConfirmationClick = () => {
    handleAnchorClose();
    setIsConfirmationOpen(true);
  };

  const handleDelete = async () => {
    if (!token) {
      return setSnackbar({
        message: "You must be logged in to delete tweets...",
        severity: "info",
        open: true,
      });
    }
    handleAnchorClose();
    setIsDeleting(true);
    const jsonId = JSON.stringify(token.id);
    mutation.mutate(jsonId);
  };

  return (
    <div>
      <div
        className={`w-full flex flex-col items-start border-b-[1px] border-borderColor p-4 gap-4 overflow-hidden transition-colors ease-in-out hover:bg-hover ${
          tweet.isReply && "reply"
        }`}
      >
        <div className="flex gap-3 w-full">
          <div>
            <Link className="mb-auto" href={`/${tweet.author.username}`}>
              <Avatar
                className="avatar"
                sx={{ width: 50, height: 50 }}
                alt=""
                src={
                  tweet.author.photoUrl
                    ? getFullURL(tweet.author.photoUrl)
                    : "/assets/egg.jpg"
                }
              />
            </Link>
          </div>
          <div className="flex items-center ">
            <Link
              className="flex items-center gap-[0.35rem] hover:underline"
              href={`/${tweet.author.username}`}
            >
              <span className="font-bold text-[0.93rem] flex items-center hover:underline">
                {tweet.author.name !== ""
                  ? tweet.author.name
                  : tweet.author.username}
                {tweet.author.isPremium && (
                  <span className="blue-tick" data-blue="Verified Blue">
                    <AiFillTwitterCircle />
                  </span>
                )}
              </span>
              <span className="text-[0.75rem] opacity-75 cursor-pointer whitespace-nowrap ">
                @{tweet.author.username}
              </span>
            </Link>
            {token && token.username === tweet.author.username && (
              <>
                <button
                  className="ml-auto text-[1.25rem] hover:bg-twitterLightGray "
                  onClick={handleAnchorClick}
                >
                  <RxDotsHorizontal />
                </button>
                <Menu
                  anchorEl={anchorEl}
                  onClose={handleAnchorClose}
                  open={Boolean(anchorEl)}
                >
                  <MenuItem
                    onClick={handleConfirmationClick}
                    className="delete"
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="overflow-wrap-anyehwere leading-normal text-[0.875rem] whitespace-pre-line">
            {tweet.isReply && (
              <Link
                href={`/${tweet.repliedTo.author.username}`}
                className="absolute top-6 font-light text-twitterMuted text-[0.9rem] leading-[0.5px]"
              >
                <span className="font-normal text-twitterDarkBlue hover:underline">
                  @{tweet.repliedTo.author.username}
                </span>
              </Link>
            )}{" "}
            {tweet.text}
          </div>
          {tweet.photoUrl && (
            <>
              <div className="border-[1px] border-borderColor rounded-[1.5rem] overflow-hidden mt-2 w-fit">
                <Image
                  onClick={handleImageClick}
                  src={getFullURL(tweet.photoUrl)}
                  alt="tweet image"
                  placeholder="blur"
                  blurDataURL={shimmer(500, 500)}
                  height={500}
                  width={500}
                  className="object-cover block cursor-pointer max-w-[100%]"
                />
              </div>
              <PreviewDialog
                open={isPreviewOpen}
                handlePreviewClose={handlePreviewClose}
                url={tweet.photoUrl}
              />
            </>
          )}
          <span className="text-twitterMuted text-[0.75rem] opacity-75 cursor-pointer whitespace-nowrap">
            {formatDateExtended(tweet.createdAt)}
          </span>
          <Counters tweet={tweet} />
          <div className="max-w-[400px] flex justify-between mt-2 translate-[-6px, -6px] ">
            <Reply tweet={tweet} />
            <Retweet tweetId={tweet._id} tweetAuthor={tweet.author.username} />
            <Like tweetId={tweet._id} tweetAuthor={tweet.author.username} />
            <Share
              tweetUrl={`https://${window.location.hostname}/${tweet.author.username}/tweets/${tweet._id}`}
            />
          </div>
        </div>
      </div>
      <div className="w-full">{token && <NewReply token={token} tweet={tweet} />} </div>

        <Replies  tweetId={tweet._id} tweetAuthor={tweet.author.username}/>

      {snackbar.open && (
        <CustomSnackbar
          message={snackbar.message}
          severity={snackbar.severity}
          setSnackbar={setSnackbar}
        />
      )}
      {isConfirmationOpen && (
        <div className="z-[9999] fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center">
          <dialog
            open
            className="border-[1px] border-borderColor bg-backgroundPrimary text-twitterBlack rounded-[1rem] shadow-[0 25px 50px -12px rgba(0, 0, 0 , 0.25)] confirm"
          >
            <h1 className="text-[1.2rem]">Delete Tweet?</h1>
            <p className="text-sm text-twitterMuted font-normal">
              This can’t be undone and it will be removed from your profile, the
              timeline of any accounts that follow you, and from Twitter search
              results.
            </p>
            {isDeleting ? (
              <CircularLoading />
            ) : (
              <>
                <button
                  className="btn bg-twitterRed text-constWhite hover:bg-twitterDarkRed"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="btn text-twitterBlack bg-backgroundPrimary border-[1px] border-twitterLightGray hover:bg-hover hover:text-twitterBlack"
                  onClick={() => setIsConfirmationOpen(false)}
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

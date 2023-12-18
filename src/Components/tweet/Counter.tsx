import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { TweetProps } from "@/types/TweetProps";
import User from "../user/User";
import { AuthContext } from "@/app/(twitter)/layout";
import { scrollToBottom } from "@/utilities/Misc/scrollToBottom";
import CustomSnackbar from "../mics/CustomSnackbar";
import { SnackbarProps } from "@/types/snackbarProps";
import { UserTypes } from "@/types/userTypes";

export default function Counters({ tweet }: { tweet: TweetProps }) {
    const [dialogType, setDialogType] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const { token } = useContext(AuthContext);

    const handleDialogOpen = (type: string) => {
        if (!token) {
            return setSnackbar({
                message: "You need to log in to view likes or retweets.",
                severity: "info",
                open: true,
            });
        }

        setDialogType(type);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogType("");
        setIsDialogOpen(false);
    };

    return (
        <>
            {tweet.likedBy.length === 0 && tweet.retweetedBy.length === 0 ? null : (
                <div className="boder-b-[1px] border-borderColor">
                    <div className=" flex gap-2">
                        {tweet.replies.length > 0 && (
                            <button className="border-none font-inherit bg-inherit text-inherit cursor-pointer hover:underline" onClick={scrollToBottom}>
                                <span className="gont-[900] text-[1rem] text-twitterBlack gap-2">
                                    {tweet.replies.length} <span className="text-twitterMuted hover:underline font-normal text-[0.85rem]">Replies</span>
                                </span>
                            </button>
                        )}
                        {tweet.retweetedBy.length > 0 && (
                            <button className="border-none font-inherit bg-inherit text-inherit cursor-pointer hover:underline" onClick={() => handleDialogOpen("retweets")}>
                                <span className="gont-[900] text-[1rem] text-twitterBlack gap-2">
                                    {tweet.retweetedBy.length} <span className="text-twitterMuted hover:underline font-normal text-[0.85rem]">Retweets</span>
                                </span>
                            </button>
                        )}
                        {tweet.likedBy.length > 0 && (
                            <button className="border-none font-inherit bg-inherit text-inherit cursor-pointer hover:underline" onClick={() => handleDialogOpen("likes")}>
                                <span className="gont-[900] text-[1rem] text-twitterBlack gap-2">
                                    {tweet.likedBy.length} <span className="text-twitterMuted hover:underline font-normal text-[0.85rem]">Likes</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
            {isDialogOpen && (
                <Dialog className="dialog" open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="xs">
                    <DialogTitle className="title">
                        {dialogType === "likes" ? "Liked by" : dialogType === "retweets" ? "Retweeted by" : ""}
                    </DialogTitle>
                    <DialogContent sx={{ paddingX: 0 }}>
                        <div className="user-list">
                            {dialogType === "likes"
                                ? tweet.likedBy.map((user: UserTypes) => (
                                      <div className="flex items-center gap-3 min-h-[90px] py-0 px-4 transition-colors ease-in-out hover:bg-hover" key={"like-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))
                                : tweet.retweetedBy.map((user: UserTypes) => (
                                      <div className="flex items-center gap-3 min-h-[90px] py-0 px-4 transition-colors ease-in-out hover:bg-hover" key={"retweet-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </>
    );
}

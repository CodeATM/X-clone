import Image from "next/image";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { LogOutDialogProps } from "@/types/ModalProps";
import CircularLoading from "../mics/CircularLoading";

export default function LogOutDialog({ open, handleLogOutClose, logout, isLoggingOut }: LogOutDialogProps) {
    return (
        <Dialog className="dialog" open={open} onClose={handleLogOutClose}>
            <Image className="m-auto pt-4" src="/X-icon.png" alt="" width={40} height={40} />
            <DialogTitle className="text-[1.75rem] font-semibold text-twitterBlack text-center p-4">{isLoggingOut ? "Logging out..." : "Log out of X?"}</DialogTitle>
            <DialogContent>
                <DialogContentText className="text-twitterMuted text-[0.933rem]">You can always log back in at any time.</DialogContentText>
            </DialogContent>
            {isLoggingOut ? (
                <CircularLoading />
            ) : (
                <div className="gap-3 mb-6 items-center button-group">
                    <button className="btn w-[75%] text-twitterWhite bg-twitterBlack hover:bg-twitterLightBlack text-twitterWhite" onClick={logout} autoFocus>
                        Log out
                    </button>
                    <button className="btn w-[75%] text-twitterBlack bg-backgroundPrimary border-[1px] border-twitterLightGray hover:bg-hover text-twitterBlack" onClick={handleLogOutClose}>
                        Cancel
                    </button>
                </div>
            )}
        </Dialog>
    );
}
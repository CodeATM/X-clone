import Image from "next/image";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { LogOutDialogProps } from "@/types/ModalProps";
import CircularLoading from "../mics/CircularLoading";

export default function LogOutDialog({ open, handleLogOutClose, logout, isLoggingOut }: LogOutDialogProps) {
    return (
        <Dialog className="dialog" open={open} onClose={handleLogOutClose}>
            <Image className="m-auto pt-4" src="/assets/favicon.png" alt="" width={40} height={40} />
            <DialogTitle className="font-bold text-twitterBlack text-center p-4 text-[1.75rem]">{isLoggingOut ? "Logging out..." : "Log out of Twitter?"}</DialogTitle>
            <DialogContent>
                <DialogContentText className="text-muted">You can always log back in at any time.</DialogContentText>
            </DialogContent>
            {isLoggingOut ? (
                <CircularLoading />
            ) : (
                <div className="gap-3 mb-6 items-center button-group">
                    <button className="w-[70%] btn-dark" onClick={logout} autoFocus>
                        Log out
                    </button>
                    <button className="w-[70%] btn-white" onClick={handleLogOutClose}>
                        w-[70%]
                    </button>
                </div>
            )}
        </Dialog>
    );
}
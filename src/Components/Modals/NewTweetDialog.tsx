import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { NewTweetDialogProps } from '@/types/ModalProps'
import NewTweet from "../tweet/NewTweet";

export default function NewTweetDialog({ open, handleNewTweetClose, token }: NewTweetDialogProps) {
    const [isSubmitted, setIsSubmited] = useState(false);

    const handleSubmit = () => {
        setIsSubmited(!isSubmitted);
    };

    useEffect(() => {
        handleNewTweetClose();
    }, [isSubmitted]);

    return (
        <Dialog className="dialog" open={open} onClose={handleNewTweetClose} maxWidth={"xs"} fullWidth>
            <div className="relative p-2 overflow-hidden">
                <NewTweet token={token} handleSubmit={handleSubmit} />
            </div>
        </Dialog>
    );
}

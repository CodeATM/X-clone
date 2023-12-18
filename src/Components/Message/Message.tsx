import { MessageProps } from "@/types/Messagesprops";
import { useState } from "react";
import Image from "next/image";

import { formatDate } from "@/utilities/date";
import { getFullURL } from '@/utilities/getFullURL'
import PreviewDialog from "../Modals/PreviewModal";
import { shimmer } from "@/utilities/Misc/shimmer";

export default function Message({ message, messagedUsername }: { message: MessageProps; messagedUsername: string }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreviewClick = () => {
        setIsPreviewOpen(true);
    };
    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };

    return (
        <div className={`message ${message.sender.username === messagedUsername ? "message-left" : "ml-auto text-right bg-twitter-blue text-constWhite"}`}>
            <div className=" whitespace-pre-line text-[0.9rem] bg-hover rounded-[1.2rem] py-3 px-4 w-fit max-w-[310px] overflow">{message.text}</div>
            {message.photoUrl && (
                <>
                    <div className="border-[1px] border-borderColor rounded-[1.5rem] overflow-hidden mt-2 w-fit">
                        <Image
                            onClick={handlePreviewClick}
                            src={getFullURL(message.photoUrl)}
                            alt="message image"
                            placeholder="blur"
                            blurDataURL={shimmer(250, 250)}
                            height={250}
                            width={250}
                            className="object-cover block cursor-pointer"
                        />
                    </div>
                    <PreviewDialog open={isPreviewOpen} handlePreviewClose={handlePreviewClose} url={message.photoUrl} />
                </>
            )}
            <div className="pt-1 text-[0.75rem] text-twitterMuted">{formatDate(message.createdAt)}</div>
        </div>
    );
}

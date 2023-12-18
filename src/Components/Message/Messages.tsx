import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

import Message from "./Message";
import NewMessageBox from "./NewMessageBox";
import { MessageProps, MessagesProps } from "@/types/Messagesprops";

export default function Messages({ selectedMessages, messagedUsername, handleConversations, token }: MessagesProps) {
    const [freshMessages, setFreshMessages] = useState([] as MessageProps[]);

    const messagesWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFreshMessages(selectedMessages);
    }, [selectedMessages]);

    useEffect(() => {
        const messagesWrapper = messagesWrapperRef.current;
        messagesWrapper?.scrollTo({
            top: messagesWrapper.scrollHeight,
            behavior: "smooth",
        });
    }, [freshMessages]);

    return (
        <main className="grid grid-col h-screen">
            <div className="p-4 flex items-center gap-4 borderb-[1px] border-borderColor sticky z-50 top-0 bg-backgroundPrimary opacity-90 ">
                <button className="icon-hoverable btn btn-white border-none" onClick={() => handleConversations(false)}>
                    <FaArrowLeft />
                </button>
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-[1.33rem]">{messagedUsername}</span>
                </div>
            </div>
            <div className="fex flex-col gap-2 p-4 overflow-auto border-b-[1px] border-borderColor " ref={messagesWrapperRef}>
                {freshMessages.length > 0 &&
                    freshMessages.map((message: MessageProps) => (
                        <Message key={message.id} message={message} messagedUsername={messagedUsername} />
                    ))}
            </div>
            <NewMessageBox
                messagedUsername={messagedUsername}
                token={token}
                setFreshMessages={setFreshMessages}
                freshMessages={freshMessages}
            />
        </main>
    );
}

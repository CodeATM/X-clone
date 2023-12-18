"use client";

import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BsEnvelopePlus } from "react-icons/bs";

import NothingToShow from "@/Components/mics/NothingToShow";
import NewMessages from "@/Components/Modals/NewMessages";
import { AuthContext } from "../layout";
import CircularLoading from "@/Components/mics/CircularLoading";
import { getUserMessages } from "@/utilities/fetch";
import Conversation from "@/Components/Message/Conversation";
import { ConversationResponse, MessageProps } from '@/types/Messagesprops'
import Messages from "@/Components/Message/Messages";

export default function MessagesPage() {
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    const [isConversationSelected, setIsConversationSelected] = useState({
        selected: false,
        messages: [] as MessageProps[],
        messagedUsername: "",
    });

    const { token, isPending } = useContext(AuthContext);

    const { isLoading, data, isFetched } = useQuery({
        queryKey: ["messages", token && token.username],
        queryFn: () => token && getUserMessages(token.username),
        enabled: !!token,
    });

    const handleNewMessageClose = () => {
        setIsNewMessageOpen(false);
    };

    const handleConversations = (isSelected: boolean, messages: MessageProps[] = [], messagedUsername: string = "") => {
        setIsConversationSelected({ selected: isSelected, messages, messagedUsername });
    };

    if (isPending || !token || isLoading) return <CircularLoading />;

    const conversations = data.formattedConversations;

    return (
        <main className="messages-page relative">
            {isConversationSelected.selected ? (
                <Messages
                    selectedMessages={isConversationSelected.messages}
                    messagedUsername={isConversationSelected.messagedUsername}
                    handleConversations={handleConversations}
                    token={token}
                />
            ) : (
                <>
                    <h1 className="py-8 px-4 text-[1.2rem] font-bold border-borderColor border-[1px] sticky z-50 top-0 bg-backgroundPrimary opacity-90">
                        Messages
                        <button
                            onClick={() => setIsNewMessageOpen(true)}
                            className="btn btn-white text-[1rem] transition-none  absolute right-4 top-6 border-[1px] border-twitterLightGray"
                        >
                            <BsEnvelopePlus />
                        </button>
                    </h1>
                    {isFetched && !(conversations.length > 0) && <NothingToShow />}
                    <div>
                        {conversations.map((conversation: ConversationResponse) => {
                            return (
                                <Conversation
                                    key={conversation.participants.join("+")}
                                    conversation={conversation}
                                    token={token}
                                    handleConversations={handleConversations}
                                />
                            );
                        })}
                    </div>
                </>
            )}
            <NewMessages handleNewMessageClose={handleNewMessageClose} open={isNewMessageOpen} token={token} />
        </main>
    );
}

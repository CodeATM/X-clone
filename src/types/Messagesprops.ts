import { UserTypes } from "./userTypes";

export type MessageProps = {
    id: string;
    sender: UserTypes;
    recipient: UserTypes;
    text: string;
    createdAt: Date;
    photoUrl: string;
};

export type ConversationResponse = {
    participants: string[];
    messages: MessageProps[];
};

export type ConversationProps = {
    conversation: ConversationResponse;
    token: UserTypes;
    handleConversations: (isSelected: boolean, messages?: MessageProps[], messagedUsername?: string) => void;
};

export type MessagesProps = {
    selectedMessages: MessageProps[];
    messagedUsername: string;
    handleConversations: (isSelected: boolean, messages?: MessageProps[], messagedUsername?: string) => void;
    token: UserTypes;
};

export type MessageFormProps = {
    token: UserTypes;
    messagedUsername: string;
    setFreshMessages: any;
    freshMessages: MessageProps[];
};
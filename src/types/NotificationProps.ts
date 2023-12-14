import { UserTypes } from "./userTypes";

export type NotificationProps = {
    recipient: string;
    type: NotificationTypes;
    secret: string;
    id: string;
    user: UserTypes;
    content: string;
    notificationContent: NotificationContent;
    isRead: boolean;
};

export type NotificationTypes = "welcome" | "follow" | "like" | "reply" | "retweet" | "message";

export type NotificationContent = null | {
    content: null | {
        id: string;
    };
    sender: {
        name: string;
        username: string;
        photoUrl: string;
    };
};

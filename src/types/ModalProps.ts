import { UserTypes } from "./userTypes";

export type ModalProps = {
    toggleState: number;
    toggleTab: any;
};

export type SignUpModal = {
    open: boolean;
    handleSignUpClose: () => void;
};

export type NewMessageDialogProps = {
    open: boolean;
    handleNewMessageClose: () => void;
    token: UserTypes;
    recipient?: string;
};

export type NewTweetDialogProps = {
    open: boolean;
    handleNewTweetClose: () => void;
    token: UserTypes;
};

export type LogOutDialogProps = {
    open: boolean;
    handleLogOutClose: () => void;
    logout: () => void;
    isLoggingOut: boolean;
};

export type PreviewDialogProps = {
    open: boolean;
    handlePreviewClose: () => void;
    url: string;
};
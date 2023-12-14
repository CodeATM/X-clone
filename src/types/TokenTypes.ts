import { UserTypes } from "./userTypes";

export type VerifiedToken = UserTypes | null;

export type AuthProps = {
    token: VerifiedToken
    isPending: boolean
    refreshToken: () => Promise<void>
}
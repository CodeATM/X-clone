import { useContext } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import Link from "next/link";
import { AiFillTwitterCircle } from "react-icons/ai";
import { getFullURL } from "@/utilities/getFullURL";
import { UserTypes } from "@/types/userTypes";
import { AuthContext } from "@/app/(twitter)/layout";
import Follow from "./Follow";

export default function User({ user }: { user: UserTypes }) {
    const { token } = useContext(AuthContext);

    const router = useRouter();

    const handleProfileClick = () => {
        router.push(`/${user.username}`);
    };

    return (
        <>
            <Link href={`/${user.username}`}>
                <Image
                    className="avatar"
                    width= {50} height = {50}
                    alt=""
                    src={user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
                />
            </Link>
            <div onClick={handleProfileClick} className="w-[100%] cursor-pointer">
                <div className="flex flex-col gap-[0.15rem]">
                    <div className="flex justify-between">
                        <div className="flex flex-col justify-center gap-[0.15rem]">
                            <span className="font-bold text-[0.93rem] hover:underline">
                                {user.name !== "" ? user.name : user.username}
                                {user.isPremium && (
                                    <span className="blue-tick" data-blue="Verified Blue">
                                        <AiFillTwitterCircle />
                                    </span>
                                )}
                            </span>
                            <span className="text-muted">@{user.username}</span>
                        </div>
                        {token && user.username !== token.username && <Follow profile={user} />}
                    </div>
                    <span className="text-[0.875rem] leading-normal overflow-x-auto">{user.description}</span>
                </div>
            </div>
        </>
    );
}

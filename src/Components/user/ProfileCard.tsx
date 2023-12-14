import { Avatar } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AiFillTwitterCircle } from "react-icons/ai";

import { getUser } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/getFullURL";
import CircularLoading from "@/Components/mics/CircularLoading";
import { UserTypes } from "@/types/userTypes";
import { VerifiedToken } from "@/types/TokenTypes";

export default function ProfileCard({ username, token }: { username: string; token: VerifiedToken }) {
    const { isLoading, data } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUser(username),
    });

    if (isLoading) return <CircularLoading/> ;

    const isFollowingTokenOwner = () => {
        if (data.user.following.length === 0 || !token) return false;
        const isFollowing = data.user.following.some((user: UserTypes) => user.id === token.id);
        return isFollowing;
    };

    return (
        <div className="py-5 px-4 minw-[100px] max-w-[300px] flex flex-col gap-3 ">
            <div className="avatar-wrapper">
            <Avatar
                    sx={{ width: 75, height: 75 }}
                    alt=""
                    src={data.user.photoUrl ? getFullURL(data.user.photoUrl) : "/assets/egg.jpg"}
                />
            </div>
            <div className="flex flex-col gap-[0.3rem]">
                <h1 className="font-[900] text-[1.2rem]">
                    {data.user.name !== "" ? data.user.name : data.user.username}
                    {data.user.isPremium && (
                        <span className="blue-tick" data-blue="Verified Blue">
                            <AiFillTwitterCircle />
                        </span>
                    )}
                </h1>
                <div className="text-twitterMuted">
                    @{data.user.username} {isFollowingTokenOwner() && <span className=" text-[0.6rem] font-medium bg-twitterWhite text-twitterBlack ps-1 rounded-lg">Follows you</span>}
                </div>
            </div>
            {data.user.description && <div className="text-[0.9rem] leeading-normal overflow-[wrap] ">{data.user.description}</div>}
            <div className="profile-info-popularity">
                <div className="flex gap-4">
                    <span className="font-[900]">{data.user.following.length}</span> <span className="text-twitterMuted">Following</span>
                </div>
                <div className="popularity-section">
                    <span className="font-[900]">{data.user.followers.length}</span> <span className="text-twitterMuted">Followers</span>
                </div>
            </div>
        </div>
    );
}

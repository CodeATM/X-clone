import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineClose } from "react-icons/ai";

import { getRandomThreeUsers } from "@/utilities/fetch";
import User from "../user/User";

export default function WhoToFollow() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    const { data, isFetched } = useQuery(["random"], getRandomThreeUsers, { enabled: isEnabled });

    const handleClose = () => {
        setIsOpen(false);
        setIsEnabled(false);
    };

    useEffect(() => {
        if (isFetched) {
            setIsEnabled(false);
        }
    }, [data, isFetched]);

    return (
        <>
            {isOpen && data && data.users && data.users.length > 0 && (
                <div className="border-[1px] border-borderColor rounded-[1rem] bg-twitterWhite p-4 flex fex-col gap-4 relative ">
                    <h1 className="font-extrabold text-[1.25rem]">
                        Who to follow
                        <button className="btn-close icon-hoverable right-sidebar-close" onClick={handleClose}>
                            <AiOutlineClose />
                        </button>
                    </h1>
                    <div className="flex items-center gap-3">
                        <User user={data.users[0]} />
                    </div>
                    {data.users.length > 1 && (
                        <div className="flex items-center gap-3">
                            <User user={data.users[1]} />
                        </div>
                    )}
                    {data.users.length > 2 && (
                        <div className="flex items-center gap-3">
                            <User user={data.users[2]} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

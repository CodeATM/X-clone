
"use client";

import { useContext } from "react";
import Link from "next/link";

import { AuthContext } from "@/app/(twitter)/layout";
import Search from "../SidebarComponents/Search";
import Legal from "../SidebarComponents/Legal";
import WhoToFollow from "../SidebarComponents/WhoToFollow"
import CompleteProfileReminder from "../SidebarComponents/CompleteProfile";

type Props = {}

const RightSidebar = (props: Props) => {
  const { token, isPending } = useContext(AuthContext);
  return (
    <aside className="relative hidden md:block">
    <div className="fixed flex flex-col gap-6 p-4 h-screen border-l-[1px] border-borderColor min-w-[190px] max-w-[300px]">
        <Search />
        {token && <WhoToFollow />}
        {token && <CompleteProfileReminder token={token} />}
        {!isPending && !token && (
            <div className="border-[1px] rounded-[1rem] border-borderColor p-4 flex flex-col relative gap-4 bg-twitterWhite">
                <h1 className="font-[800] text-[1.25rem] ">Don’t miss what’s happening</h1>
                <p className=" text-[.8rem] ">People on Twitter are the first to know.</p>
                <div className="scale-[0.75] -mb-4">
                    <Link href="/" className="m-1 mb-6 flex justify-center btn btn-white">
                        Log In
                    </Link>
                    <Link href="/" className="m-1 mb-6 flex justify-center btn  btn-dark">
                        Sign Up
                    </Link>
                </div>
            </div>
     )}
        <Legal />
    </div>
</aside>
  )
}

export default RightSidebar
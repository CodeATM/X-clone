
"use client";

import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex flex-col gap-8 justify-center items-center h-screen bg-backgroundBlue z-10 fixed">
            <Image src="/x-icon.png" alt="" width={75} height={75} />
            <h1 className="text-[3.5rem] font-[300] text-constWhite">Sorry, that page doesn&apos;t exist!</h1>
            <a href="/" className="text-constWhite text-[1.2rem] font-[900] transition 0.2s ease-in-out hover:text-twitterLightGray">Return to the homepage</a>
        </div>
    );
}



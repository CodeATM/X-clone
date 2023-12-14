import React from "react";
import Image from "next/image";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen bg-backgroundBlue z-10 fixed">
      <Image src="/x-icon" alt="not-found" width={70} height={70} />
      <h1 className="text-[3.5rem] font-[300] text-constWhite">Sorry, This page does not exist</h1>
      <a href="/explore" className="text-constWhite text-[1.2rem] font-[900] transition 0.2s ease-in-out hover:text-twitterLightGray">Return to homepage</a>
    </div>
  );
};

export default NotFound;

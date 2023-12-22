"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import SignUpDialog from "@/Components/Modals/SignupModal";
import LogInDialog from "@/Components/Modals/LoginModal";
import LoadingComponent from "@/Components/LoadingComponent";
import CustomSnackbar from "@/Components/mics/CustomSnackbar";
import { SnackbarProps } from "@/types/snackbarProps";

export default function Home() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isLoggingAsTest, setIsLoggingAsTest] = useState(false);


  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
  };
  const handleSignUpClose = () => {
    setIsSignUpOpen(false);
  };
  const handleLogInClick = () => {
    setIsLogInOpen(true);
  };
  const handleLogInClose = () => {
    setIsLogInOpen(false);
  };

  return (
    <>
      <main className="h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block">
          <Image src="/root.png" alt="login_image" fill className="cover" />
        </div>
        <div className="flex flex-col justify-center gap-6 md:pl-[7.5vw] md:pr-[22.5vw] p-4 min-w-[200px]">
          <Image src="/x-icon.png" width={40} height={40} alt="logo" />
          <h1 className="font-bold text-[1.5rem] leading-[1.25]">
            Get latest news in the world at your ease.
          </h1>
          <p className="font-bold text-[0.9rem]">Join X today.</p>
          <div className="flex flex-col gap-4 justify-center">
            <button className="btn" onClick={handleSignUpClick}>
              Create account
            </button>
            <button className="btn btn-light" onClick={handleLogInClick}>
              Sign in
            </button>
          </div>
        </div>
      </main>

      <SignUpDialog open={isSignUpOpen} handleSignUpClose={handleSignUpClose} />
      <LogInDialog open={isLogInOpen} handleLogInClose={handleLogInClose} />
    </>
  );
}

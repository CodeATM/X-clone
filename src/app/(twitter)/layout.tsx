"use client";

import { createContext } from "react";

import LeftSidebar from "@/Components/Sidebars/LeftSidebar";
import RightSidebar from "@/Components/Sidebars/RightSidebar";
import { AuthProps } from "@/types/TokenTypes";
import useAuth from "@/hooks/useAuth";


const AuthContext = createContext<AuthProps>({
  token: null,
  isPending: true,
  refreshToken: () => Promise.resolve(),
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth()

  return (
      <div className="layout">
        <AuthContext.Provider value={auth}>
        <LeftSidebar />
          {children}
        <RightSidebar />
        </AuthContext.Provider>
      </div>

  );
}

export { AuthContext };

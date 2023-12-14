"use client";

import { createContext } from "react";

import LeftSidebar from "@/Components/Sidebars/LeftSidebar";
import RightSidebar from "@/Components/Sidebars/RightSidebar";
import { AuthProps } from "@/types/TokenTypes";
import useAuth from "@/hooks/useAuth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <div className="layout">
        <LeftSidebar />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <RightSidebar />
        {/* <Footer /> */}
      </div>
    </AuthContext.Provider>
  );
}

export { AuthContext };

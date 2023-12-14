"use client";

import { useQuery } from "@tanstack/react-query";
import NotFound from "@/app/not-found";
import Profile from "@/Components/user/Profile";
import { getUser } from "@/utilities/fetch";
import CircularLoading from '@/Components/mics/CircularLoading'

export default function ProfileLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { isLoading, isFetched, data } = useQuery({
    queryKey: ["users", username],
    queryFn: () => getUser(username),
  });

  if (isLoading) return <CircularLoading/> ;

  if (isFetched && !data.user) return <NotFound />;

  return (
    <div className="mt-10 flex flex-col">
      {isFetched && <Profile profile={data.user} />}
      {children}
    </div>
  );
}

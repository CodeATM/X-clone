"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { AuthContext } from "../layout";
import { getNotifications, markNotificationsRead } from "@/utilities/fetch";
import CircularLoading from "@/Components/mics/CircularLoading";
import NothingToShow from "@/Components/mics/NothingToShow";
import { NotificationProps } from "@/types/NotificationProps";
import Notification from "@/Components/mics/Notification";

export default function NotificationsPage() {
    const { token, isPending } = useContext(AuthContext);

    const queryClient = useQueryClient();

    const { isLoading, data, isFetched } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const mutation = useMutation({
        mutationFn: markNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
        onError: (error) => console.log(error),
    });

    const handleNotificationsRead = () => {
        mutation.mutate();
    };

    useEffect(() => {
        if (isFetched && data.notifications.filter((notification: NotificationProps) => !notification.isRead).length > 0) {
            const countdownForMarkAsRead = setTimeout(() => {
                handleNotificationsRead();
            }, 1000);

            return () => {
                clearTimeout(countdownForMarkAsRead);
            };
        }
    }, []);

    if (isPending || !token || isLoading) return <CircularLoading />;

    return (
        <main>
            <h1 className="py-8 px-4 text-[1.25rem] font-bold border-borderColor border-b-[1px] sticky z-50 top-0 bg-backgroundPrimary opacity-50">Notifications</h1>
            {isFetched && data.notifications.length === 0 ? (
                <NothingToShow />
            ) : (
                <div className="notifications-wrapper">
                    {data.notifications.map((notification: NotificationProps) => (
                        <Notification key={notification.id} notification={notification} token={token} />
                    ))}
                </div>
            )}
        </main>
    );
}

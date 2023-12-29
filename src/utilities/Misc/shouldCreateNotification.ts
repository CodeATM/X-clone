import mongoose from 'mongoose';
import { connectToDB } from '../mongoose';
const NotificationModel = mongoose.model('Notification'); // Assuming you have a Mongoose model named "Notification"

export const shouldCreateNotification = async (sender: string, recipient: string) => {
    connectToDB()
    try {
        const lastNotification = await NotificationModel.findOne({
            type: "message",
            'user.username': recipient,
            'content': { $regex: sender, $options: 'i' }, // Case-insensitive match for sender in content
        })
        .sort({ createdAt: 'desc' })
        .exec();

        if (!lastNotification) return true;

        const currentTime = Date.now();
        const lastNotificationTime = new Date(lastNotification.createdAt).getTime();
        const oneHour = 60 * 60 * 1000;

        return currentTime - lastNotificationTime >= oneHour;
    } catch (error) {
        console.error('Error checking notification:', error);
        return false; // Handle the error according to your application's needs
    }
};

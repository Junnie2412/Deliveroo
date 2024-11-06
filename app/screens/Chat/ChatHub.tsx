import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";

interface Message {
    userId: string;
    message: string;
    sentAt: string;
}

export const ChatHub = ({ onMessageReceived }: { onMessageReceived: (userId: string, message: string, sentAt: string) => void }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);  // Type HubConnection
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectToChatHub = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl("http://deliveroowebapp.azurewebsites.net/chatHub")
                .build();

            newConnection.on("ReceiveMessage", (userId: string, message: string, sentAt: string) => {
                onMessageReceived(userId, message, sentAt);
            });

            try {
                // Start the connection
                await newConnection.start();
                setConnection(newConnection);
                setIsConnected(true);
            } catch (error) {
                console.error("Error while starting connection: ", error);
            }
        };

        connectToChatHub();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection]);
    const sendMessage = async (userId: string, message: string) => {
        if (connection && isConnected) {
            await connection.invoke("SendMessage", userId, message);
        }
    };

    return { sendMessage };
};

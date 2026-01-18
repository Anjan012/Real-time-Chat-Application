import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Children, createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } = useAppStore.getState();

                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log("message received:", message);
                    addMessage(message);
                }
                addContactsInDMContacts(message);
            };

            const handleReceiveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();

                if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
                    addMessage(message);
                }
                addChannelInChannelList(message);
            };

            // 🆕 NEW: Handle when user is removed from channel
            const handleRemovedFromChannel = ({ channelId }) => {
                const { removeChannelById } = useAppStore.getState();
                console.log("You were removed from channel:", channelId);
                removeChannelById(channelId);
            };

            // 🆕 NEW: Handle when user leaves channel
            const handleLeftChannel = ({ channelId }) => {
                const { removeChannelById } = useAppStore.getState();
                console.log("You left the channel:", channelId);
                removeChannelById(channelId);
            };

            // Register all socket event listeners
            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message", handleReceiveChannelMessage);
            socket.current.on("removed-from-channel", handleRemovedFromChannel); // 🆕
            socket.current.on("left-channel", handleLeftChannel); // 🆕

            return () => {
                socket.current.disconnect();
            };
        }
    }, [userInfo]);

    useEffect(() => {
  if (socket.current) {
    socket.current.on("channel-deleted", ({ channelId }) => {
      const { removeChannelById } = useAppStore.getState();
      removeChannelById(channelId);
    });

    return () => {
      socket.off("channel-deleted");
    };
  }
}, [socket]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
import axios from "axios";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const LeaveButton = () => {
    const {
        selectedChatData,
        channelMembers,
        setChannelMembers,
        userInfo,
        closeMembersPanel,
        closeChat,
        removeChannelById, // 🆕 Add this
        socket, // 🆕 Add this
    } = useAppStore();

    const handleLeave = async () => {
        try {
            const confirmLeave = confirm("Are You sure you want to leave this Channel?");

            if (confirmLeave) {
                await axios.post(
                    `${HOST}/api/channel/leave`,
                    { channelId: selectedChatData._id },
                    { withCredentials: true }
                );

                // 🆕 Emit socket event
                if (socket) {
                    socket.emit("user-left-channel", {
                        channelId: selectedChatData._id,
                        userId: userInfo.id,
                    });
                }

                // 🆕 Remove channel from user's list
                removeChannelById(selectedChatData._id);

                setChannelMembers(
                    channelMembers.filter((m) => m._id !== userInfo.id)
                );

                closeMembersPanel();
                closeChat();
            } else {
                return;
            }
        } catch (err) {
            console.error("Failed to leave channel", err);
        }
    };

    return (
        <button
            onClick={handleLeave}
            className="text-xs bg-red-600 p-2 rounded font-bold"
        >
            Leave Channel
        </button>
    );
};

export default LeaveButton;
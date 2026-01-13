import axios from "axios";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const RemoveButton = ({ memberId }) => {
    const { selectedChatData, channelMembers, setChannelMembers, socket } = useAppStore();

    const handleRemove = async () => {
        try {
            let removeUser = confirm("Are you Sure you want to remove User?");

            if(removeUser){
                await axios.post(
                    `${HOST}/api/channel/remove-member`,
                    {
                        channelId: selectedChatData._id,
                        userIdToRemove: memberId,
                    },
                    { withCredentials: true }
                );

                // 🆕 Emit socket event to notify the removed user
                if (socket) {
                    socket.emit("user-removed-from-channel", {
                        channelId: selectedChatData._id,
                        removedUserId: memberId,
                    });
                }

                // Update UI instantly
                setChannelMembers(
                    channelMembers.filter((m) => m._id !== memberId)
                );
            } else {
                return;
            }
        } catch (err) {
            console.error("Failed to remove member", err);
        }
    };

    return (
        <button
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-500"
        >
            Remove
        </button>
    );
};

export default RemoveButton;
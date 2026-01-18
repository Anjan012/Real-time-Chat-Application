import axios from "axios";
import { HOST, DELETE_CHANNEL_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";

const DeleteChannelButton = () => {
  const {
    selectedChatData,
    removeChannelById,
    closeChat,
    closeMembersPanel,
    socket,
  } = useAppStore();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this channel?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${HOST}/api/channel/${selectedChatData._id}`,
        { withCredentials: true }
      );

      console.log("Channel deleted:", response.data);

      // Update UI first
      removeChannelById(selectedChatData._id);
      closeMembersPanel();
      closeChat();

      // Then notify others via socket
      if (socket && socket.connected) {
        socket.emit("channel-deleted", {
          channelId: selectedChatData._id,
        });
      }
    } catch (err) {
      console.error("Failed to delete channel:", err);
      alert("Failed to delete channel. Please try again.");
    }
  };

  return (
    <button 
      className="text-xs bg-red-700 p-2 rounded font-bold hover:bg-red-800"
      onClick={handleDelete}
    >
      Delete Channel
    </button>
  );
};

export default DeleteChannelButton;

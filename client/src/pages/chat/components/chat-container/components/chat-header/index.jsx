import { RiCloseFill, RiGroupLine, RiDeleteBinLine } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, DELETE_CHANNEL_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import axios from "axios";
import AddMembersButton from "./AddMemberButton";

const ChatHeader = () => {
  const { 
    closeChat, 
    selectedChatData, 
    selectedChatType, 
    openMembersPanel, 
    userInfo,
    removeChannelById,
    closeMembersPanel,
    socket
  } = useAppStore();

  const isAdmin = selectedChatData?.admin?.toString() === userInfo?.id;

  const handleDeleteChannel = async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${selectedChatData.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${HOST}/api/channel/${selectedChatData._id}`,
        { withCredentials: true }
      );

      removeChannelById(selectedChatData._id);
      closeMembersPanel();
      closeChat();

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
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-6 md:px-20">
      <div className="flex items-center w-full justify-between">
        
        {/* Left Section: Avatar + Name */}
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 relative flex-shrink-0">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                    {selectedChatData.firstName
                      ? selectedChatData.firstName[0]
                      : selectedChatData.email[0]}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full text-lg font-semibold">
                #
              </div>
            )}
          </div>

          <div className="text-white font-medium">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && (
              selectedChatData.firstName 
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}` 
                : selectedChatData.email
            )}
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Channel-specific buttons */}
          {selectedChatType === "channel" && (
            <>
              {/* Members Panel Button */}
              <button
                onClick={() => openMembersPanel()}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#2a2b33] transition-all duration-200"
                title="View Members"
              >
                <RiGroupLine className="text-xl" />
              </button>

              {/* Admin-only buttons */}
              {isAdmin && (
                <>
                  {/* Add Members */}
                  <AddMembersButton />
                  
                  {/* Delete Channel */}
                  <button
                    onClick={handleDeleteChannel}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-[#2a2b33] transition-all duration-200"
                    title="Delete Channel"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                </>
              )}
            </>
          )}

          {/* Close Chat Button */}
          <button
            onClick={closeChat}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#2a2b33] transition-all duration-200"
            title="Close Chat"
          >
            <RiCloseFill className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
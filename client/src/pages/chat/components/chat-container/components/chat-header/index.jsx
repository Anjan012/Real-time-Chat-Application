import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { RiGroupLine } from "react-icons/ri";
import DeleteChannelButton from "./DeleteChannelButton";
import AddMembersButton from "./AddMemberButton";


const ChatHeader = () => {

  // for closing the chat 
  const { closeChat, selectedChatData, selectedChatType, openMembersPanel, userInfo } = useAppStore();
  const isAdmin = selectedChatData?.admin?.toString() === userInfo?.id;

  return (
    <div className="h-[10vh] border-b-2 border-[2f303b] flex items-center justify-between px-20">

      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {
              selectedChatType === "contact" ? (<Avatar className="h-12 w-12 overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}

                  </div>
                )}

              </Avatar>) : (<div className="bg-[#ffffff22] h-10 flex items-center justify-center rounded-full"> # </div>)
            }

          </div>

          <div>
            {
              selectedChatType === "channel" && selectedChatData.name
            }
            {
              selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName}  ${selectedChatData.lastName}` : selectedChatData.email
            }
          </div>

        </div>

        {selectedChatType === "channel" && (
          <button
            onClick={() => openMembersPanel()}
            className="text-neutral-500 hover:text-white"
          >
            <RiGroupLine className="text-2xl" />
          </button>
        )}

        {
          selectedChatType === "channel" && isAdmin && (
            <>
            <AddMembersButton />
            <DeleteChannelButton />
            </>
          )
        }


        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={closeChat}>
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default ChatHeader
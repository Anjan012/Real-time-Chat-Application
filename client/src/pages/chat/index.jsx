import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import { Toaster } from "sonner";
import { ContactsContainer } from "./components/contacts-container";
import { EmptyChatContainer } from "./components/empty-chat-container";
import { ChatContainer } from "./components/chat-container";

export const Chat = () => {

  
  const {
    userInfo, 
    selectedChatType, 
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Whenever we have changes in userInfo and the navigate we should run this effect
    if(!userInfo.profileSetup) {
      // if the profile setup is not complete yet 
      toast.error("Please complete your profile setup");
      navigate("/profile");
    }
  }, [userInfo, navigate]); // now the chat page would not be accessible until the profile setup is complete

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg"> 
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {fileUploadProgress}%
          </div>
        )
      }
      {
        isDownloading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg"> 
            <h5 className="text-5xl animate-pulse">Downloading File</h5>
            {fileDownloadProgress}%
          </div>
        )
      }
      <ContactsContainer/>
      { selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/> }
      {/* <EmptyChatContainer/> */}
      {/* <ChatContainer/> */}
    </div>
  )
}
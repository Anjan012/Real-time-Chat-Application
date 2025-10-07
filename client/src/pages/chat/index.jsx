import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Whenever we have changes in userInfo and the navigate we should run this effect
    if(!userInfo.profileSetup) {
      // if the profile setup is not complete yet 
      toast.console.error("Please complete your profile setup");
      navigate("/profile");
    }
  }, [userInfo, navigate]); // now the chat page would not be accessible until the profile setup is complete

  return (
    <div>
      <h1>Chat Page</h1>
      <p>This is the Chat page!</p>
    </div>
  )
}
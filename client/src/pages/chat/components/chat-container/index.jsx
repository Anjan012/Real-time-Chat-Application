import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";

export const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">

      {/* We will have 3 components which is the chat header, message container which will store the message, and the message bar  */}

      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>

    </div>
  )
}

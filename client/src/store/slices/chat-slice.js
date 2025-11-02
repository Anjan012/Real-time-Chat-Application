export const chatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [], // array of messages
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }), // it will have the actual chat data id img etc
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    // When we close the chat we need to clear all the data related to that chat
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] })
});
import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import axios from "axios";
import { useEffect } from "react";
import MemberItem from "./MemberItem";
import { HOST } from "@/utils/constants";

const ChannelMembersPanel = () => {
    const {
        selectedChatData,
        membersPanelOpen,
        closeMembersPanel,
        channelMembers,
        setChannelMembers,
    } = useAppStore();

    useEffect(() => {
        if (!membersPanelOpen || !selectedChatData?._id) return;

        const fetchMembers = async () => {
            try {

                const { data } = await axios.get(
                    `${HOST}/api/channel/${selectedChatData._id}/members`,
                    { withCredentials: true }
                );

                setChannelMembers(data.members || []);
            } catch (error) {
                console.error("Failed to fetch members", error);
                setChannelMembers([]);
            }
        };

        fetchMembers();
    }, [membersPanelOpen, selectedChatData]);



    if (!membersPanelOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-[300px] bg-[#1c1d25] border-l border-gray-700 z-50">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">
                    Members
                </h3>
                
                <button onClick={closeMembersPanel}>
                    <RiCloseFill className="text-2xl text-gray-400" />
                </button>
            </div>

            {/* Body (members list will go here) */}
            <div className="p-4 text-gray-400">
                {channelMembers.length === 0 ? (
                    <p className="text-sm text-gray-500">No members found</p>
                ) : (
                    channelMembers.map((member) => (
                        <MemberItem key={member._id} member={member} />
                    ))
                )}

            </div>
        </div>
    );
};

export default ChannelMembersPanel;

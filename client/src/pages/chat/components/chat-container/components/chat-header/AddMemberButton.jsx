import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTACTS_ROUTE, ADD_CHANNEL_MEMBER_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const AddMembersButton = () => {
    const { selectedChatData, setChannelMembers, channelMembers } = useAppStore();

    const [addMemberModal, setAddMemberModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                
                // Fetch all contacts
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                    withCredentials: true
                });

                console.log("All contacts:", response.data.contacts);
                console.log("Current members:", channelMembers);

                // Get current member IDs
                const existingMemberIds = channelMembers.map(member => member._id);
                
                // Filter out existing members
                const availableContacts = response.data.contacts.filter(
                    contact => !existingMemberIds.includes(contact.value)
                );

                console.log("Available contacts:", availableContacts);
                setAllContacts(availableContacts);
                
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (addMemberModal) {
            getData();
        }
    }, [addMemberModal, channelMembers]);

    const addMembers = async () => {
        try {
            if (selectedContacts.length === 0) {
                alert("Please select at least one member to add");
                return;
            }

            setLoading(true);

            // Add members one by one
            for (const contact of selectedContacts) {
                await apiClient.post(
                    ADD_CHANNEL_MEMBER_ROUTE,
                    {
                        channelId: selectedChatData._id,
                        userIdToAdd: contact.value,
                    },
                    { withCredentials: true }
                );
            }

            // Refresh member list
            const membersResponse = await apiClient.get(
                `api/channel/${selectedChatData._id}/members`,
                { withCredentials: true }
            );

            setChannelMembers(membersResponse.data.members);
            setSelectedContacts([]);
            setAddMemberModal(false);
            
            alert(`Successfully added ${selectedContacts.length} member(s)`);
            
        } catch (error) {
            console.error("Error adding members:", error);
            alert(error.response?.data || "Failed to add members. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <button
                            className="text-xs bg-purple-700 p-2 rounded font-bold hover:bg-purple-800 flex items-center gap-2"
                            onClick={() => setAddMemberModal(true)}
                        >
                            <FaUserPlus />
                            Add Members
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] text-white border-none mb-2 p-3">
                        Add members to this channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={addMemberModal} onOpenChange={setAddMemberModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[350px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Add Members to {selectedChatData?.name}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Select users to add to this channel
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">Loading contacts...</p>
                            </div>
                        ) : (
                            <MultipleSelector
                                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                                defaultOptions={allContacts}
                                placeholder="Search Contacts"
                                value={selectedContacts}
                                onChange={setSelectedContacts}
                                emptyIndicator={
                                    <p className="text-center leading-10 text-gray-600">
                                        {allContacts.length === 0 
                                            ? "All users are already members" 
                                            : "No results found"}
                                    </p>
                                }
                            />
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            className="flex-1 bg-gray-600 hover:bg-gray-700 transition-all duration-300"
                            onClick={() => {
                                setSelectedContacts([]);
                                setAddMemberModal(false);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={addMembers}
                            disabled={selectedContacts.length === 0 || loading}
                        >
                            {loading ? "Adding..." : `Add ${selectedContacts.length > 0 ? `(${selectedContacts.length})` : "Members"}`}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddMembersButton;
import { useEffect, useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
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
                
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                    withCredentials: true
                });

                const existingMemberIds = channelMembers.map(member => member._id);
                const availableContacts = response.data.contacts.filter(
                    contact => !existingMemberIds.includes(contact.value)
                );

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

            const membersResponse = await apiClient.get(
                `api/channel/${selectedChatData._id}/members`,
                { withCredentials: true }
            );

            setChannelMembers(membersResponse.data.members);
            setSelectedContacts([]);
            setAddMemberModal(false);
            
        } catch (error) {
            console.error("Error adding members:", error);
            alert(error.response?.data || "Failed to add members. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Icon Button */}
            <button
                onClick={() => setAddMemberModal(true)}
                className="p-2 rounded-lg text-neutral-400 hover:text-purple-500 hover:bg-[#2a2b33] transition-all duration-200"
                title="Add Members"
            >
                <RiUserAddLine className="text-xl" />
            </button>

            {/* Modal */}
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
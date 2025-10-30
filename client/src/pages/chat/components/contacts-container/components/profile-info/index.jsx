import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { useAppStore } from "@/store/index.js";
import { getColor } from "@/lib/utils";
import { use } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {IoLogOut, IoPowerSharp} from "react-icons/io5"
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {

    // getting the user info from the store
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    // this function is used to handle the logout functionality since logout can be tricky we need to delete the cookies and also clear the user info from the store
    const logout = async () => {
        try {

            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });

            if(response.status === 200) {
                // if logout is successful then we need to clear the user info from the store
                navigate("/auth");
                setUserInfo(null);
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt="profile"
                                className="object-cover w-full h-full bg-black"
                            />
                        ) : (
                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {userInfo.firstName
                                    ? userInfo.firstName.split("").shift()
                                    : userInfo.email.split("").shift()}

                            </div>
                        )}

                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>

            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium" onClick={() => navigate("/profile")}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white" >
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl font-medium" onClick={logout}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white" >
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo
import { useAppStore } from "@/store";
import RemoveButton from "./RemoveButton";
import LeaveButton from "./LeaveButton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const MemberItem = ({ member }) => {
  const { userInfo, selectedChatData } = useAppStore();

  const isAdmin = selectedChatData?.admin?.toString() === userInfo?.id;
  const isSelf = member._id === userInfo.id;

  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-[#2a2b33]">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-full overflow-hidden">
          {member.image && (
            <AvatarImage
              src={`${HOST}/${member.image}`}
              alt="profile"
              className="object-cover w-full h-full"
            />
          )}
          <AvatarFallback
            className={`uppercase h-9 w-9 text-sm flex items-center justify-center rounded-full ${getColor(
              member.color
            )}`}
          >
            {member.firstName
              ? member.firstName[0]
              : member.email[0]}
          </AvatarFallback>
        </Avatar>

        {/* Name + Email */}
        <div>
          <p className="font-medium text-white">
            {member.firstName} {member.lastName}
          </p>
          <p className="text-xs text-gray-400">{member.email}</p>
        </div>
      </div>

      {/* Right: Actions */}
      {isAdmin && !isSelf && (
        <RemoveButton memberId={member._id} />
      )}

      {isSelf && <LeaveButton />}
    </div>
  );
};

export default MemberItem;

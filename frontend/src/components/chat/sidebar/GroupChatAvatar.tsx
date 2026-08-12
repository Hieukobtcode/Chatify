import type { Participant } from "@/types/chat"
import UserAvatar from "../shared/UserAvatar";
import { Ellipse } from "lucide-react";

interface GroupChatAvatarProps {
    participants: Participant[];
    type: "chat" | "sidebar";

}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
    const avatars = [];
    const limit = Math.min(participants.length, 4);

    for (let i = 0; i < limit; i++) {
        const member = participants[i];
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={member.displayName}
                avatarUrl={member.avatarUrl ?? undefined}
            />
        );
    }
    return (
        <div className="relative flex -space-x-2  *:data-[slot=avatar]:ring-background *data-[slot=avatar]:ring-2 ">
            {avatars}
            {/* Neu thanh vien trong nhom nhieu hon 4 thi hien thi dau 3 cham */}
            {participants.length > limit && (
                <div className="flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
                <Ellipse className="size-4" />
            </div>
            )}
            
        </div>
    )
}

export default GroupChatAvatar
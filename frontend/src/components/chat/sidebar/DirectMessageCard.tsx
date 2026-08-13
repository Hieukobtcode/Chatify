import type { Conversation } from "@/types/chat"
import ChatCard from "../shared/ChatCard"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "../shared/UserAvatar";
import StatusBadge from "../shared/StatusBadge";
import UnreadCountBadge from "../shared/UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessage } = useChatStore();
    const { onlineUsers } = useSocketStore();

    if (!user) return null;

    const otherUser = convo.participants.find((p) => p._id !== user._id);
    if (!otherUser) return null;

    const unreadCounts = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.imgUrl
      ? "📷 Ảnh"
      : convo.lastMessage?.content ?? "";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessage();
        }
    }
    return (
        <ChatCard
            convoId={convo._id}
            name={otherUser.displayName ?? ""}
            timestamp={
                convo.lastMessage?.createdAt ? new Date(convo.lastMessage?.createdAt) : undefined
            }
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConversation}
            unreadCounts={unreadCounts}
            leftSection={
                <>
                    <UserAvatar type="sidebar" name={otherUser.displayName ?? ""} avatarUrl={otherUser.avatarUrl ?? undefined} />
                    {/* Soket io */}
                    <StatusBadge status={onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"} />

                    {unreadCounts > 0 && <UnreadCountBadge unreadCount={unreadCounts} />}
                </>
            }
            subtitle={
                <p className={cn("text-sm truncate", unreadCounts > 0 ? "font-medium text-foreground" : "text-muted=foreground")}>
                    {lastMessage}
                </p>
            }
        />
    )
}

export default DirectMessageCard
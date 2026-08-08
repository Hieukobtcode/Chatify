import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"
import { Separator } from "@base-ui/react";
import UserAvatar from "../../shared/UserAvatar";
import StatusBadge from "../../shared/StatusBadge";
import GroupChatAvatar from "../../sidebar/GroupChatAvatar";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { user } = useAuthStore();
  const { conversations, activeConversationId } = useChatStore();
  let otherUser;

  chat = chat ?? conversations.find((c) => c._id === activeConversationId)

  if (!chat) {
    return (
      <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full bg-background">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    )
  }

  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id)
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
  }

  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className={"-ml-1 text-foreground"} />
        <Separator orientation="vertical" className={"mr-2 data-[orientation=vertical]:h-4"} />
        <div className="p-2 w-full flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            {
              chat.type === "direct" ? (
                <>
                  <UserAvatar type={"sidebar"} name={otherUser?.displayName || "Chatify"} avatarUrl={otherUser?.avatarUrl || undefined} />
                  <StatusBadge status="offline" /></>
              ) : (
                <GroupChatAvatar participants={chat.participants} type="sidebar"  />
              )
            }
          </div>

          {/* Name */}
          <h2 className="font-semibold text-foreground ">
            {chat.type === 'direct' ? (otherUser?.displayName || "Chatify") : (chat.group?.name || "Nhóm")}
          </h2>
        </div>
      </div>
    </header>
  )
}

export default ChatWindowHeader
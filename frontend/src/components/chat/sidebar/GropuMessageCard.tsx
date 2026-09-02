import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore';
import type { Conversation } from '@/types/chat'
import ChatCard from '../shared/ChatCard';
import UnreadCountBadge from '../shared/UnreadCountBadge';
import GroupChatAvatar from './GroupChatAvatar';
import { memo } from 'react';

const GropuMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages , fetchMessage} = useChatStore();

    if (!user) return null;

    const unreadCounts = convo.unreadCounts[user._id];
    const name = convo.group?.name ?? "";
    const lastMessage = convo.lastMessage?.audioUrl
      ? "🎤 Tin nhắn thoại"
      : convo.lastMessage?.fileUrl
        ? `📎 ${convo.lastMessage?.fileName || "Tệp đính kèm"}`
        : convo.lastMessage?.imgUrl
          ? "📷 Ảnh"
          : convo.lastMessage?.content ?? "Chưa có tin nhắn";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            fetchMessage();
        }
    }
    return (
        <ChatCard
            convoId={convo._id}
            name={name}
            timestamp={
                convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined
            }
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConversation}
            unreadCounts={unreadCounts}
            leftSection={
               <>
                {unreadCounts>0 && <UnreadCountBadge unreadCount={unreadCounts} />}
                <GroupChatAvatar participants={convo.participants } type="chat" />
               </>
            }
            subtitle={
                <p className='text-sm truncate text-muted-foreground'>{lastMessage}</p>
            }
        />
    )
}

// Memo để tránh re-render khi conversations khác thay đổi
export default memo(GropuMessageCard, (prev, next) => {
  return prev.convo._id === next.convo._id && prev.convo.lastMessage?._id === next.convo.lastMessage?._id;
})

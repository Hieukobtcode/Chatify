import { useChatStore } from '@/stores/useChatStore'
import GropuMessageCard from './GropuMessageCard';
import ChatListSkeleton from './ChatListSkeleton';

const GroupChatList = () => {
  const { conversations, convoLoading } = useChatStore();

  if (convoLoading) {
    return <ChatListSkeleton count={3} />;
  }

  const groupConversations = conversations.filter((convo) => convo.type === "group");

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        groupConversations.map((convo) => (
          <GropuMessageCard
            key={convo._id}
            convo={convo}
          />
        ))
      }
    </div>
  )
}

export default GroupChatList

import { useChatStore } from '@/stores/useChatStore'
import GropuMessageCard from './GropuMessageCard';

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

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
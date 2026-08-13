import { useChatStore } from '@/stores/useChatStore'
import DirectMessageCard from './DirectMessageCard';
import ChatListSkeleton from './ChatListSkeleton';

const DirectMesageList = () => {
  const { conversations, convoLoading } = useChatStore();

  if (convoLoading) {
    return <ChatListSkeleton count={5} />;
  }

  const directConversations = conversations.filter((convo) => convo.type === "direct");

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        directConversations.map((convo) => (
          <DirectMessageCard
            key={convo._id}
            convo={convo}
          />
        ))
      }
    </div>
  )
}

export default DirectMesageList

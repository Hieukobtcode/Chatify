import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "../ChatWelcomeScreeen";
import MessageItem from "../../shared/MessageItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Infinitive from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessage,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");

  const key = `chat-scroll-${activeConversationId}`;
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();

  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages when opening a conversation
  useEffect(() => {
    if (!activeConversationId) return;

    // Only fetch if we haven't loaded messages for this conversation yet
    const existing = allMessages[activeConversationId];
    if (!existing || existing.items.length === 0) {
      fetchMessage(activeConversationId);
    }
  }, [activeConversationId, allMessages, fetchMessage]);

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;
    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConvo?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConvo]);

  // Scroll to bottom when conversation changes or new messages arrive
  useLayoutEffect(() => {
    if (!messageEndRef.current) {
      return;
    }

    messageEndRef.current.scrollIntoView({
      block: "end",
    });
  }, [activeConversationId, messages.length]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  const fetchMoreMessage = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessage(activeConversationId);
    } catch (error) {
      console.error("Loi xay ra khi fetch them tin nhan:", error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    const item = sessionStorage.getItem(key);
    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length, key, activeConversationId]);

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        <div ref={messageEndRef}></div>
        <Infinitive
          dataLength={messages.length}
          next={fetchMoreMessage}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>Loading...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={message._id ?? index}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </Infinitive>
      </div>
    </div>
  );
};

export default ChatWindowBody;
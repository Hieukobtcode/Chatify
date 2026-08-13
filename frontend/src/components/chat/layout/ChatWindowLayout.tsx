import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreeen from "./ChatWelcomeScreeen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatWindowHeader from "./component/ChatWindowHeader";
import ChatWindowBody from "./component/ChatWindowBody";
import MessageInput from "./component/MessageInput";
import { useEffect } from "react";

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    markAsSeen,
  } = useChatStore();
  const selectedConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectedConvo) {
      return;
    }

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Loi khi mark seen:", error);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvo]);

  if (!selectedConvo) {
    return <ChatWelcomeScreeen />;
  }

  if (loading) {
    return (
      <SidebarInset className="flex h-full flex-1 flex-col overflow-hidden rounded-sm shadow-md">
        <ChatWindowSkeleton />
      </SidebarInset>
    );
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>

      {/* Footer */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;

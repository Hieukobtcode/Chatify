import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant, Reaction } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, SmilePlus } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const QUICK_REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "😡"];

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const { user } = useAuthStore();
  const { toggleReaction } = useChatStore();
  const [showReactions, setShowReactions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  const formatFileSize = (bytes?: number | null) => {
    if (bytes == null) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number | null) => {
    if (seconds == null) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const downloadFile = async () => {
    if (!message.fileUrl) return;

    try {
      const res = await fetch(message.fileUrl);
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = message.fileName || "attachment";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    }
  };

  const aggregatedReactions = (() => {
    const map = new Map<string, { count: number; reactedByMe: boolean }>();
    (message.reactions ?? []).forEach((r: Reaction) => {
      const entry = map.get(r.emoji) ?? { count: 0, reactedByMe: false };
      entry.count += 1;
      if (r.userId === user?._id) entry.reactedByMe = true;
      map.set(r.emoji, entry);
    });
    return Array.from(map.entries());
  })();

  const handleReaction = async (emoji: string) => {
    setShowReactions(false);
    await toggleReaction(message._id, emoji);
  };

  return (
    <>
      {/* Time divider - centered like Zalo/Messenger */}
      {isShowTime && (
        <div className="flex items-center justify-center my-3">
          <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-0.5">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        </div>
      )}

        <div
          className={cn(
            "flex gap-2 message-bounce mt-1",
            message.isOwn ? "justify-end pr-3" : "justify-start",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Chatify"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message */}
        <div
          className={cn(
            "max-w-xs lg:max-w-wd space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1",
              message.isOwn ? "flex-row-reverse" : "flex-row",
            )}
          >
            <Card
              className={cn(
                message.imgUrl ? "p-1" : "p-3",
                message.isOwn
                  ? "chat-bubble-sent border-0"
                  : "chat-bubble-received",
              )}
            >
              {message.imgUrl && (
                <img
                  src={message.imgUrl}
                  alt="Ảnh tin nhắn"
                  className="h-auto w-56 max-w-full rounded-md object-cover"
                />
              )}

              {message.audioUrl && (
                <div className="flex flex-col gap-1 py-1">
                  <audio
                    src={message.audioUrl}
                    controls
                    className="h-10 w-56 max-w-full"
                  />
                  {message.audioDuration != null && (
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(message.audioDuration)}
                    </span>
                  )}
                </div>
              )}

              {message.fileUrl && (
                <button
                  type="button"
                  onClick={downloadFile}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-foreground/5 transition-smooth"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-5 text-primary" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="max-w-52 truncate text-sm font-medium">
                      {message.fileName || "Tệp đính kèm"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(message.fileSize)}
                    </span>
                  </div>
                  <Download className="size-4 shrink-0 text-muted-foreground" />
                </button>
              )}

              {message.content && (
                <p className="text-sm leading-relaxed break-words">
                  {message.content}
                </p>
              )}
            </Card>

            {showReactions ? (
              <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1 shadow-sm">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleReaction(emoji)}
                    className="flex size-7 items-center justify-center rounded-full text-base transition-smooth hover:scale-125 hover:bg-muted"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              isHovered && (
                <button
                  type="button"
                  onClick={() => setShowReactions(true)}
                  className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:scale-110 hover:bg-muted hover:text-foreground"
                >
                  <SmilePlus className="size-4" />
                </button>
              )
            )}
          </div>

          {/* existing reactions */}
          {aggregatedReactions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {aggregatedReactions.map(([emoji, info]) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-smooth hover:scale-105",
                    info.reactedByMe
                      ? "border-primary/40 bg-primary/15"
                      : "border-border bg-muted/40",
                  )}
                >
                  <span>{emoji}</span>
                  <span className="text-muted-foreground">{info.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* seen / delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <Badge
              variant={"outline"}
              className={cn(
                "text-xs px-1.5 py-0.5 h-4 border-0",
                lastMessageStatus === "seen"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {lastMessageStatus}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
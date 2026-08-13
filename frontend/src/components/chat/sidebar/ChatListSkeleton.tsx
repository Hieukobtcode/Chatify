const ChatListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex-1 space-y-2 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border-none p-3"
        >
          <div className="size-12 shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3.5 w-2/5 rounded bg-muted animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListSkeleton;
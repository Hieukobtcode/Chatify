import { Skeleton } from "@/components/ui/skeleton";

const ChatWindowSkeleton = () => {
  return (
    <div className="flex h-full flex-col rounded-sm bg-primary-foreground">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex flex-1 flex-col justify-end gap-3 p-4">
        <div className="flex items-end gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-16 w-2/5 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-14 w-1/2 rounded-2xl" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-10 w-1/3 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-20 w-2/5 rounded-2xl" />
        </div>
      </div>

      {/* Input skeleton */}
      <div className="flex items-center gap-2 border-t border-border/50 p-3">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </div>
    </div>
  );
};

export default ChatWindowSkeleton;
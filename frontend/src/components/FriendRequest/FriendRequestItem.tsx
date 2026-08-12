import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/shared/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}
const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: RequestItemProps) => {
  if (!requestInfo) {
    return null;
  }
  const info = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!info) {
    return null;
  }
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar type="sidebar" name={info.displayName} avatarUrl={info.avatarUrl} />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{info.displayName}</p>
          <p className="text-xs text-muted-foreground truncate">@{info.username}</p>
        </div>
      </div>
      <div className="shrink-0 ml-3">{actions}</div>
    </div>
  );
};

export default FriendRequestItem;
import type { User } from "@/types/user";
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../chat/shared/UserAvatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/stores/useSocketStore";
import AvatarUploader from "./AvatarUploader";

interface ProfileCardProps {
  user: User | null;
}
const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();

  if (!user) {
    return null;
  }

  if (!user.bio) {
    user.bio = "Your bio";
  }

  const isOnline = onlineUsers.includes(user._id);

  return (
    <Card className="overflow-hidden p-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <CardContent className="pt-20 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
        <div className="relative shrink-0">
          <UserAvatar
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarUrl ?? undefined}
            className="ring-4 ring-white shadow-lg"
          />
          {/* Upload avatar */}
          <AvatarUploader />
        </div>

        {/* User info */}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {user.displayName}
          </h1>
          {user.bio && (
            <p className="text-white/70 text-sm mt-2 max-w-lg line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        {/* Status */}
        <Badge
          className={cn(
            "flex items-center gap-1 capitalize shrink-0",
            isOnline ? "bg-green-700 text-white" : "bg-slate-100 text-slate-700",
          )}
        >
          <div
            className={cn(
              "size-2 rounded-full",
              isOnline ? "bg-green-500 animate-pulse" : "bg-slate-500",
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
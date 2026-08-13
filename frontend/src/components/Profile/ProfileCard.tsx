import type { ElementType } from "react";
import type { User } from "@/types/user";
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../chat/shared/UserAvatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/stores/useSocketStore";
import AvatarUploader from "./AvatarUploader";
import { AtSign, CalendarDays, Info, Mail, Phone } from "lucide-react";

interface ProfileCardProps {
  user: User | null;
}

interface InfoRowProps {
  icon: ElementType;
  label: string;
  value: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => {
  return (
    <div className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-smooth hover:bg-muted/50">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();

  if (!user) {
    return null;
  }

  const isOnline = onlineUsers.includes(user._id);

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Chưa rõ";

  return (
    <Card className="overflow-hidden p-0">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 pb-6 pt-8">
        <div className="pointer-events-none absolute inset-0 bg-black/10" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="relative shrink-0">
            <UserAvatar
              type="profile"
              name={user.displayName}
              avatarUrl={user.avatarUrl ?? undefined}
              className="ring-4 ring-white/90 shadow-lg"
            />
            <AvatarUploader />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              {user.displayName}
            </h1>
            <p className="mt-0.5 text-sm text-white/70">@{user.username}</p>
          </div>

          <Badge
            className={cn(
              "flex items-center gap-1.5 capitalize",
              isOnline
                ? "bg-green-600 text-white"
                : "bg-white/20 text-white backdrop-blur",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                isOnline ? "animate-pulse bg-green-300" : "bg-white/70",
              )}
            />
            {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <CardContent className="space-y-5 p-4 sm:p-6">
        {/* Bio */}
        <div className="rounded-xl bg-muted/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Info className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Giới thiệu
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {user.bio?.trim() ? user.bio : "Chưa có thông tin giới thiệu."}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <InfoRow icon={AtSign} label="Username" value={`@${user.username}`} />
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow
            icon={Phone}
            label="Số điện thoại"
            value={user.phone?.trim() ? user.phone : "Chưa cập nhật"}
          />
          <InfoRow icon={CalendarDays} label="Ngày tham gia" value={joinedDate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
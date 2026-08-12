import InviteSuggestedList from "@/components/NewGroupChat/InviteSuggestedList";
import SelectedUsersList from "@/components/NewGroupChat/SelectedUsersList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import type { Friend } from "@/types/user";
import { LoaderIcon, User, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { loading, createConversation } = useChatStore();

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      !invitedUsers.some((u) => u._id === friend._id),
  );

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleGetFriends = async () => {
    await getFriends();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (invitedUsers.length === 0) {
        toast.warning("Bạn phải mời ít nhất 1 thành viên vào nhóm");
        return;
      }

      await createConversation(
        "group",
        groupName,
        invitedUsers.map((u) => u._id),
      );
      setSearch("");
      setInvitedUsers([]);
    } catch (error) {
      console.error("Loi xay ra khi sumit trong new group:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            onClick={handleGetFriends}
            className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer"
          />
        }
      >
        <User className="size-4" />
        <span className="sr-only">Tạo nhóm</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Tạo nhóm chat mới</DialogTitle>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Ten nhom */}
            <div className="space-y-2 ">
              <Label
                htmlFor="groupName"
                className="text-sm font-semibold"
              ></Label>
              <Input
                id="groupName"
                placeholder="Tên nhóm"
                className="glass border-border/50 focus:border-primary/50 transition-smooth"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            {/* Moi thanh vien */}
            <div className="space-y-2">
              <Label htmlFor="invite" className="text-sm font-semibold">
                Mời thành viên
              </Label>
              <Input
                id="invite"
                placeholder="Tìm theo tên hiển thị..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Danh sach goi y theo tim kiem */}
              {search && filteredFriends.length > 0 && (
                <InviteSuggestedList
                  filteredFriends={filteredFriends}
                  onSelect={handleSelectFriend}
                />
              )}

              {/* Danh sach user da chon */}
              <SelectedUsersList
                invitedUser={invitedUsers}
                onRemove={handleRemoveFriend}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
              >
                {loading ? (
                  <LoaderIcon
                    role="status"
                    aria-label="Loading"
                    className="size-4 animate-spin dark:text-white"
                  />
                ) : (
                  <>
                    <UserPlus className="size-4 mr-2" /> Tạo nhóm
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;
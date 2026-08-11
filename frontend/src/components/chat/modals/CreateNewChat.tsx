import FriendListModal from "@/components/CreateNewChat/FriendListModal";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore"
import { MessageCircle } from "lucide-react";

const CreateNewChat = () => {
  const { getFriends } = useFriendStore();

  const handGetFriends = async () => {
    await getFriends();
  }

  return (
    <div className="flex gap-2">
      <Card onClick={handGetFriends} className="flex-1 p-3 glass hover:shadow-soft transition-smooth cursor-pointer group/card">
        <Dialog>
          <DialogTrigger className="flex items-center gap-4">
            <div className="size-8 bg-gradient-chat rounded-full flex items-center justify-center group-hover/card:scale-110 transition-bounce">
              <MessageCircle className="size-4 text-whtie" />
            </div>
            <span className="text-sm font-medium capitalize">Gửi tin nhắn mới</span>
          </DialogTrigger>
          <FriendListModal/>
        </Dialog>
      </Card>
    </div>
  )
}

export default CreateNewChat
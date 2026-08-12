import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import SentRequest from "./SentRequest";
import ReceivedRequest from "./ReceivedRequest";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequest } = useFriendStore();

  useEffect(() => {
    if (!open) return;

    const loadRequest = async () => {
      try {
        await getAllFriendRequest();
      } catch (error) {
        console.error("Loi xay ra khi load request:", error);
      }
    };

    loadRequest();
  }, [open, getAllFriendRequest]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTab("received");
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full flex flex-col min-h-0 flex-1">
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="received">Đã nhận</TabsTrigger>
            <TabsTrigger value="sent">Đã gửi</TabsTrigger>
          </TabsList>
          <TabsContent value="received" className="overflow-y-auto flex-1 mt-3">
            <ReceivedRequest />
          </TabsContent>
          <TabsContent value="sent" className="overflow-y-auto flex-1 mt-3">
            <SentRequest />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
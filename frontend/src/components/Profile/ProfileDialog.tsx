import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProfileCard from "./ProfileCard";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {

    const {user} = useAuthStore();

    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto p-0 border-0 shadow-2xl sm:max-w-lg">
        <div className="bg-gradient-glass overflow-hidden">
          {/* Heading */}
          <DialogHeader className="flex-row items-center justify-between p-4 pb-0">
            <DialogTitle className="text-xl font-bold text-foreground">
              Hồ sơ cá nhân
            </DialogTitle>
          </DialogHeader>

          <div className="p-4">
            <ProfileCard user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
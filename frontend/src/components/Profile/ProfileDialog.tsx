import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
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
      <DialogContent className="overflow-y-auto p-0 bg-transparent border-0 shadow-2xl">
        <div className="bg-gradient-glass">
          <div className="max-w-4xl mx-auto p-4">

            {/* Heading */}
            <DialogHeader className="mb-6">
                <DialogContent className="text-2xl font-bold text-foreground">
                    Profile & Setting
                </DialogContent>
            </DialogHeader>

            <ProfileCard user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;

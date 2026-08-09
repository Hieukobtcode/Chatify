import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/modals/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { LoaderIcon, UserPlus } from "lucide-react";

interface SendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUserName: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}
const SendFriendRequest = ({
  register,
  loading,
  searchedUserName,
  onSubmit,
  onBack,
}: SendRequestProps) => {
  return (
    <form onSubmit={onSubmit}>
    <div  className="space-y-4">
      <span className="success-message">
        Đã tìm thấy<span className="font-semibold">@{searchedUserName}</span>
      </span>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">
          Giới thiệu
        </Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="Chào bạn, có thể kết bạn được không?"
          className="glass border-border/50 focus:border-primary/50 transition-smooth resize-none"
          {...register("message")}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant={"outline"}
          className={"flex-1 glass hover:text-destructive"}
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className={
            "flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
          }
        >
          {loading ? (
            <>
              <LoaderIcon
                role="status"
                aria-label="Loading"
                className="size-4 animate-spin dark:text-white"
              />
            </>
          ) : (
            <>
              <UserPlus className="size-4 mr-2" /> Kết bạn
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  </form>)
};

export default SendFriendRequest;

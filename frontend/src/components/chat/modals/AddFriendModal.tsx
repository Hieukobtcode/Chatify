import SearchForm from "@/components/AddFriendModal/SearchForm";
import SendFriendRequest from "@/components/AddFriendModal/SendFriendRequest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore";
import type { User } from "@/types/user";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUserName, setsearchedUserName] = useState("");
  const { loading, searchByUserName, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: { username: "", message: "" },
  });

  const usernameValue = watch("username");

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setsearchedUserName(username);

    try {
      const foundUser = await searchByUserName(username);

      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;
    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      toast.success(message);
      handleCancel();
    } catch (error) {
      console.error("Lỗi xảy ra khi gửi request từ form:", error);
    }
  });

  const handleCancel = () => {
    reset();
    setsearchedUserName("");
    setIsFound(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="flex justify-center items-center size-5
          rounded-full hover:bg-sidebar-accent cursor-pointer z-10"
        >
          <UserPlus className="size-4" />
          <span className="sr-only">Kết bạn</span>
        </div>
      </DialogTrigger>

      <DialogContent className={"sm:max-w-[425px] border-none"}>
        <DialogHeader>
          <DialogTitle>Kết bạn</DialogTitle>
        </DialogHeader>
        {!isFound && (
          <>
            <SearchForm
              register={register}
              errors={errors}
              usernameValue={usernameValue}
              loading={loading}
              isFound={isFound}
              searchedUsername={searchedUserName}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          </>
        )}
        {isFound && (
          <>
            <SendFriendRequest
              register={register}
              loading={loading}
              searchedUserName={searchedUserName}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;

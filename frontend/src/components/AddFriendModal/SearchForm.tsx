import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/modals/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { LoaderIcon, Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 ">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semiblod">
          Tìm bằng username
        </Label>
        <Input
          id="username"
          placeholder="Nhập username để kết bạn"
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          {...register("username", {
            required: "Username không được bỏ trống",
          })}
        ></Input>
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}

        {isFound === false && (
          <span className="text-sm text-destructive">
            Không tìm thấy người dùng
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose>
          <Button
            type="button"
            variant={"outline"}
            className={"flex-1 glass hover:text-destructive"}
            onClick={onCancel}
          >
            Hủy
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className={
            "flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth "
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
              <Search className="size-4 mr-2" />
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;

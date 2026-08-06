import * as React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        tabIndex={-1}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {show ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
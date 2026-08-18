import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { FileText, ImagePlus, Paperclip, Send, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import EmojiPicker from "../../shared/EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { chatService, type AttachmentPayload } from "@/services/chatService";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const [value, setValue] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<{
    file: File;
    name: string;
    size: number;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  if (!user) return;

  const resetImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetAttachment = () => {
    setAttachment(null);
    if (attachInputRef.current) {
      attachInputRef.current.value = "";
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFile = () => {
    attachInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(url);
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File không được vượt quá 50MB");
      return;
    }

    setAttachment({ file, name: file.name, size: file.size });
  };

  const sendMessage = async () => {
    if ((!value.trim() && !imageFile && !attachment) || sending) return;

    setSending(true);
    try {
      let imgUrl: string | undefined;
      let attachmentPayload: AttachmentPayload | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploaded = await chatService.uploadMessageImage(formData);
        imgUrl = uploaded.imgUrl;
      }

      if (attachment) {
        const formData = new FormData();
        formData.append("file", attachment.file);
        const uploaded = await chatService.uploadMessageFile(formData);
        attachmentPayload = {
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName,
          fileSize: uploaded.fileSize,
          fileType: uploaded.fileType,
        };
      }

      const content = value.trim();
      setValue("");
      resetImage();
      resetAttachment();

      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        if (!otherUser) return;
        await sendDirectMessage(
          otherUser._id,
          content,
          imgUrl,
          attachmentPayload,
        );
      } else {
        await sendGroupMessage(
          selectedConvo._id,
          content,
          imgUrl,
          attachmentPayload,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn, hãy thử lại");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasContent = !!value.trim() || !!imageFile || !!attachment;

  return (
    <div className="flex flex-col gap-2 bg-background p-3">
      {imagePreview && (
        <div className="relative self-start">
          <img
            src={imagePreview}
            alt="Ảnh xem trước"
            className="h-32 w-32 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={resetImage}
            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-smooth hover:scale-110"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {attachment && (
        <div className="flex items-center gap-2 self-start rounded-lg border border-border bg-muted/30 p-2 pr-3">
          <FileText className="size-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="max-w-48 truncate text-sm font-medium">
              {attachment.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(attachment.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={resetAttachment}
            className="ml-1 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

        <input
          ref={attachInputRef}
          type="file"
          hidden
          onChange={handleAttachmentChange}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth"
          onClick={handleSelectImage}
          type="button"
        >
          <ImagePlus className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth"
          onClick={handleSelectFile}
          type="button"
        >
          <Paperclip className="size-4" />
        </Button>

        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Soạn tin nhắn"
            className="h-9 bg-white pr-20 border-border/50 focus:border-primary/50 transition-smooth"
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <div className="flex size-8 items-center justify-center rounded-md transition-smooth hover:bg-primary/10">
              <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
            </div>
          </div>
        </div>

        <Button
          onClick={sendMessage}
          className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
          disabled={!hasContent || sending}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
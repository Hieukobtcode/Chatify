import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { FileText, ImagePlus, Mic, Paperclip, Send, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import EmojiPicker from "../../shared/EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { chatService, type AttachmentPayload, type AudioPayload } from "@/services/chatService";
import { toast } from "sonner";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

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

  // voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopMediaTracks();
    };
  }, []);

  if (!user) return;

  const stopMediaTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

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

  const resetAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
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

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        toast.error("Trình duyệt không hỗ trợ ghi âm");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const type = mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const duration = Math.round(
          (Date.now() - startedAtRef.current) / 1000,
        );

        stopMediaTracks();

        if (blob.size === 0) {
          toast.error("Không thu được âm thanh");
          setIsRecording(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setAudioDuration(duration);
        setIsRecording(false);
      };

      startedAtRef.current = Date.now();
      setRecordingSeconds(0);
      setAudioBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setIsRecording(true);

      recorder.start();

      timerRef.current = setInterval(() => {
        setRecordingSeconds(
          Math.round((Date.now() - startedAtRef.current) / 1000),
        );
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi truy cập micro:", error);
      toast.error("Không thể truy cập microphone");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.stop();
    }
    stopMediaTracks();
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const sendMessage = async () => {
    if ((!value.trim() && !imageFile && !attachment && !audioBlob) || sending)
      return;

    setSending(true);
    try {
      let imgUrl: string | undefined;
      let attachmentPayload: AttachmentPayload | undefined;
      let audioPayload: AudioPayload | undefined;

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

      if (audioBlob) {
        const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
        const formData = new FormData();
        formData.append("file", audioBlob, `voice-${Date.now()}.${ext}`);
        const uploaded = await chatService.uploadMessageAudio(formData);
        audioPayload = {
          audioUrl: uploaded.audioUrl,
          audioDuration: uploaded.audioDuration || audioDuration,
        };
      }

      const content = value.trim();
      setValue("");
      resetImage();
      resetAttachment();
      resetAudio();

      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        if (!otherUser) return;
        await sendDirectMessage(
          otherUser._id,
          content,
          imgUrl,
          attachmentPayload,
          audioPayload,
        );
      } else {
        await sendGroupMessage(
          selectedConvo._id,
          content,
          imgUrl,
          attachmentPayload,
          audioPayload,
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

  const hasContent = !!value.trim() || !!imageFile || !!attachment || !!audioBlob;

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

      {audioUrl && !isRecording && (
        <div className="flex items-center gap-2 self-start rounded-lg border border-border bg-muted/30 p-2 pr-3">
          <audio src={audioUrl} controls className="h-10 max-w-56" />
          <span className="text-xs text-muted-foreground">
            {formatDuration(audioDuration)}
          </span>
          <button
            type="button"
            onClick={resetAudio}
            className="ml-1 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 self-start rounded-lg border border-red-300 bg-red-50 p-2 pr-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
          </span>
          <span className="text-sm font-medium text-red-600">
            Đang ghi âm {formatDuration(recordingSeconds)}
          </span>
          <button
            type="button"
            onClick={cancelRecording}
            className="ml-1 flex size-7 items-center justify-center rounded-full text-red-500 transition-smooth hover:bg-red-100"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={stopRecording}
            className="flex size-7 items-center justify-center rounded-full bg-red-500 text-white transition-smooth hover:bg-red-600"
          >
            <Square className="size-3.5" />
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

        {hasContent ? (
          <Button
            onClick={sendMessage}
            className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
            disabled={sending}
          >
            <Send className="size-4 text-white" />
          </Button>
        ) : isRecording ? null : (
          <Button
            onClick={startRecording}
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 transition-smooth"
            type="button"
          >
            <Mic className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
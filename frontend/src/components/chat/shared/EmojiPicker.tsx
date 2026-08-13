import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThemeStore } from "@/stores/useThemeStore"
import { Smile } from "lucide-react";
import EmojiPickerReact, { EmojiStyle, Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

interface EmojiPicker{
    onChange: (value:string) => void
}
const EmojiPicker = ({onChange} : EmojiPicker) => {
    const {isDark} = useThemeStore();

  return (
    <Popover>
        <PopoverTrigger className={"cursor-pointer"}>
            <Smile className="size-4"/>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" sideOffset={8} className="w-auto max-w-[min(90vw,350px)] bg-transparent border-none shadow-none drop-shadow-none p-0">
            <div className="w-[min(90vw,350px)]">
                <EmojiPickerReact
                theme={isDark ? Theme.DARK : Theme.LIGHT} 
                onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
                emojiStyle={EmojiStyle.NATIVE}
                width="100%"
                />
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker

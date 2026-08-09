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
        <PopoverContent side="right" sideOffset={40} className="bg-tranparent border-none shadow-none drop-shadow-none mb-12">
            <EmojiPickerReact
            theme={isDark ? Theme.DARK : Theme.LIGHT} 
            onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
            emojiStyle={EmojiStyle.NATIVE}
            />
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker

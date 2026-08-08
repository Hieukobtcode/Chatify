import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { Switch } from "../ui/switch"
import CreateNewChat from "../chat/modals/CreateNewChat"
import NewGroupChatModal from "../chat/modals/NewGroupChatModal"
import GroupChatList from "../chat/sidebar/GroupChatList"
import AddFriendModal from "../chat/modals/AddFriendModal"
import DirectMesageList from "../chat/sidebar/DirectMesageList"
import { useThemeStore } from "@/stores/useThemeStore"
import { useAuthStore } from "@/stores/useAuthStore"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  return (
    <Sidebar variant="inset" {...props}>

      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>

            <SidebarMenuButton size="lg" className="bg-gradient-primary rounded-2xl overflow-hidden shadow-lg">
              <div className="flex w-full items-center px-2 justify-between">
                <h1 className="text-xl font-bold text-white">Chatify</h1>
                <div className="flex items-center gap-2">
                  <Sun className="size-4 text-white/80" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-background/80" />
                  <Moon className="size-4 text-white/80" />
                </div>
              </div>

            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">

        {/* New Chat */}
        <SidebarGroup>
          <SidebarContent>
            <CreateNewChat />
          </SidebarContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Nhóm Chat
          </SidebarGroupLabel>
          <SidebarGroupAction title="Tạo nhóm" className="cursor-pointer">
            <NewGroupChatModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dirrect Message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title="Kết bạn" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMesageList />
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>

    </Sidebar>
  )
}

"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  Mail,
  LogOut,
  Store,
  Home,
  UserCog,
  ChevronUp,
} from "lucide-react"

export function AppSidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth()

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Overview",
        url: "overview",
        icon: Home,
        roles: ["admin", "marketing_manager", "support_agent", "viewer"],
      },
      {
        title: "Customers",
        url: "customers",
        icon: Users,
        roles: ["admin", "marketing_manager", "support_agent", "viewer"],
      },
      {
        title: "Orders",
        url: "orders",
        icon: ShoppingCart,
        roles: ["admin", "marketing_manager", "support_agent", "viewer"],
      },
      {
        title: "Support Tickets",
        url: "support",
        icon: MessageSquare,
        roles: ["admin", "support_agent"],
      },
      {
        title: "Marketing",
        url: "marketing",
        icon: Mail,
        roles: ["admin", "marketing_manager"],
      },
      {
        title: "Analytics",
        url: "analytics",
        icon: BarChart3,
        roles: ["admin", "marketing_manager"],
      },
      {
        title: "User Management",
        url: "users",
        icon: UserCog,
        roles: ["admin"],
      },
    ]

    return baseItems.filter((item) => user?.role && item.roles.includes(user.role))
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">India E-Commerce</span>
                  <span className="truncate text-xs">CRM Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activeView === item.url} onClick={() => setActiveView(item.url)}>
                    <button className="flex items-center gap-2 w-full">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs capitalize">{user?.role?.replace("_", " ")}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

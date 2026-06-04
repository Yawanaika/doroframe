"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BotIcon,
  Settings2Icon,
  WaypointsIcon,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const data = {
    user: { name: "guest", email: "未登录", avatar: "/icon.png" },
    navMain: [
      {
        title: t("nav.state"),
        url: "/",
        icon: <WaypointsIcon />,
        items: [
          { title: t("nav.state"), url: "/state" },
          { title: t("nav.weekly"), url: "/state/weekly" }
        ],
        isActive: true,
      },
      {
        title: "Warframe Market",
        url: "/market/items",
        icon: <BotIcon />,
        items: [
          { title: t("nav.market.items"), url: "/market/items" },
          { title: t("nav.market.auctions"), url: "/market/auctions" },
          { title: t("nav.market.me"), url: "/market/me" },
        ],
      },
      {
        title: t("nav.settings"),
        url: "/settings",
        icon: <Settings2Icon />,
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="https://github.com/Yawanaika/doroframe" target="_blank" >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="/icon.png" alt="DoroFrame Logo"/>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">DoroFrame</span>
                  <span className="">v0.0.1</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

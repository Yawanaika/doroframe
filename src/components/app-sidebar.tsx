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
  HomeIcon,
  Settings2Icon,
  WaypointsIcon,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const data = {
    navMain: [
      {
        title: t("nav.home"),
        url: "/",
        icon: <HomeIcon />,
        isActive: true,
      },
      {
        title: t("nav.state"),
        url: "/state",
        icon: <WaypointsIcon />,
        items: [
          { title: t("nav.state"), url: "/state" },
        ],
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
    <Sidebar collapsible="icon" variant="inset" {...props}>
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
                  <span className="text-muted-foreground">v0.1.0</span>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

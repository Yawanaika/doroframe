import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  LogInIcon,
  LogOutIcon,
  Settings2Icon,
  UserRoundIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { avatarUrl } from "@/features/market/assets"
import { statusOf } from "@/features/market/constants"
import { useSettingsStore } from "@/store/settings"
import { useAuthStore } from "@/store/auth"

export function NavUser() {
  const { t } = useTranslation()
  const lang = useSettingsStore((s) => s.lang)
  const user = useAuthStore((s) => s.user)
  const hydrated = useAuthStore((s) => s.hydrated)
  const hydrate = useAuthStore((s) => s.hydrate)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const path = useRouterState({ select: (s) => s.location.pathname })
  const signOut = useAuthStore((s) => s.signOut)
  const { isMobile } = useSidebar()
  const [pending, setPending] = React.useState(false)
  const isProfilePage = path.startsWith("/market/me")

  React.useEffect(() => {
    if (!hydrated) void hydrate()
  }, [hydrated, hydrate])

  const handleSignOut = async () => {
    if (pending) return
    setPending(true)
    try {
      await signOut()
    } finally {
      setPending(false)
    }
  }

  if (!hydrated) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled tooltip={t("common.loading")}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
              <UserRoundIcon />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{t("common.loading")}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!isLoggedIn() || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                isActive={isProfilePage}
                tooltip={t("market.me.login")}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <UserRoundIcon />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t("market.me.login")}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t("market.me.login.desc")}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/market/me">
                    <LogInIcon />
                    <span>{t("market.me.login")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings2Icon />
                    <span>{t("nav.settings")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const name = user.ingameName || user.slug || t("market.me.title")
  const status = statusOf(user.status)
  const statusLabel = lang === "zh" ? status.labelZh : status.labelEn
  const reputation = Number.isFinite(user.reputation)
    ? user.reputation.toLocaleString()
    : "0"
  const summary = `${statusLabel} · ${t("market.me.reputation")} ${reputation}`

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              isActive={isProfilePage}
              tooltip={t("market.me.title")}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={avatarUrl(user.avatar)} alt={name} />
                <AvatarFallback className="rounded-lg text-xs">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {summary}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={avatarUrl(user.avatar)} alt={name} />
                  <AvatarFallback className="rounded-lg text-xs">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {summary}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/market/me">
                  <BadgeCheckIcon />
                  <span>{t("market.me.title")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings2Icon />
                  <span>{t("nav.settings")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={pending}
              onSelect={() => {
                void handleSignOut()
              }}
            >
              {pending ? <Spinner /> : <LogOutIcon />}
              <span>{t("market.me.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

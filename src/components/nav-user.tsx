import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-xs text-muted-foreground">v0.1.0</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

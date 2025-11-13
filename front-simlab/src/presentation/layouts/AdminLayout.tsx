import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/presentation/components/ui/sidebar"
import { Navigate, Outlet } from "react-router-dom"
import { NavUser } from "../components/nav-user"
import { NavMain } from "../components/nav-main"
import { Toaster } from "../components/ui/sonner"
import { useAuth } from "@/application/hooks/useAuth"
import { ThemeProvider } from "@/application/context/ThemeContext"
import { filterNavByRole, navItems } from "../utils/SidebarConfig"

export default function AdminLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navMain = filterNavByRole(navItems, user.role);

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-setting">
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <NavUser user={user} logout={logout} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={navMain} />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="overflow-hidden">
          <Outlet />
          <Toaster position="top-right" richColors expand={true} closeButton />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserRound, NotebookPen, GraduationCap } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: UserRound,
  },
  {
    title: "Estudiantes",
    url: "/dashboard/estudiantes",
    icon: GraduationCap,
  },
  {
    title: "Solicitudes",
    url: "/dashboard/solicitudes",
    icon: NotebookPen,
  },
];

function AdminSidebar() {
  const [activePage, setActivePage] = useState("Solicitudes");
  const location = useLocation(); // <- de react-router-dom

  useEffect(() => {
    // /dashboard/usuarios -> ["", "dashboard", "usuarios"] -> "usuarios"
    const path = location.pathname.split("/")[2];

    if (path) {
      const item = items.find(
        (item) => item.title.toLowerCase() === path.toLowerCase()
      );
      if (item) {
        setActivePage(item.title);
      }
    }
  }, [location]);

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="flex items-center justify-center h-16">
        <Link to="/dashboard">
          <img
            src="/logo_tu_carnet.svg"
            alt="Logo"
            className="h-12 w-auto mx-auto object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.title === activePage}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AdminSidebar;

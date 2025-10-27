import { Home, FileText, Image as ImageIcon, BookOpen, Video as VideoIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const menuItems = [
  {
    title: "All Content",
    url: "/",
    icon: Home,
  },
  {
    title: "Stories",
    url: "/?filter=stories",
    icon: BookOpen,
  },
  {
    title: "Articles",
    url: "/?filter=articles",
    icon: FileText,
  },
  {
    title: "Pictures",
    url: "/?filter=pictures",
    icon: ImageIcon,
  },
  {
    title: "Videos",
    url: "/?filter=videos",
    icon: VideoIcon,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold mb-2">
            Content Feed
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

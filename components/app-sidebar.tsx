'use client';
import {Calendar, Home, Inbox, Search, Settings, Newspaper, ChartNoAxesCombined, BookOpenCheck, Bot, GraduationCap} from "lucide-react";

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
import { useRouter } from "next/navigation";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Learn",
    url: "?set=learn",
    icon: GraduationCap,
  },
  {
    title: "Chat",
    url: "?set=chat",
    icon: Bot,
  },
  {
    title: "Practice",
    url: "?set=practice",
    icon: BookOpenCheck,
  },
  {
    title: "Exam",
    url: "?set=exam",
    icon: Calendar,
  },
  {
    title: "Progress",
    url: "?set=progress",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Documents",
    url: "?set=documents",
    icon: Newspaper,
  },
  {
    title: "Settings",
    url: "?set=settings",
    icon: Settings,
  },
];

export function AppSidebar() {
    const router = useRouter();
  return (
    <Sidebar className="bg-black">
      <SidebarContent className="bg-[#252525] text-white ">
        <SidebarGroup>
          <SidebarGroupLabel
            onClick={() => router.push("/")}
            className="cursor-pointer h-[100px]"
          >
            <Image className="mx-auto mb-4" src="/Full_logo.png" alt="Logo" width={300} height={100} />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => router.push(item.url)}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
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

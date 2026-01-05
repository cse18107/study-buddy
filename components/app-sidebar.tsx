'use client';
import {Calendar, Settings, Newspaper, ChartNoAxesCombined, BookOpenCheck, Bot, GraduationCap} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";

const items = [
  {
    title: "Learn",
    url: "?set=learn",
    icon: GraduationCap,
    color: "text-black",
    bgColor: "bg-primary",
  },
  {
    title: "Chat",
    url: "?set=chat",
    icon: Bot,
    color: "text-black",
    bgColor: "bg-secondary",
  },
  {
    title: "Practice",
    url: "?set=practice",
    icon: BookOpenCheck,
    color: "text-black",
    bgColor: "bg-accent",
  },
  {
    title: "Exam",
    url: "?set=exam",
    icon: Calendar,
    color: "text-black",
    bgColor: "bg-info",
  },
  {
    title: "Progress",
    url: "?set=progress",
    icon: ChartNoAxesCombined,
    color: "text-black",
    bgColor: "bg-green-400",
  },
  {
    title: "Documents",
    url: "?set=documents",
    icon: Newspaper,
    color: "text-black",
    bgColor: "bg-blue-400",
  },
  {
    title: "Settings",
    url: "?set=settings",
    icon: Settings,
    color: "text-black",
    bgColor: "bg-slate-300",
  },
];

export function AppSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSet = searchParams?.get("set") || "learn";
  
  return (
    <Sidebar className="bg-white border-r-8 border-black">
      <SidebarContent className="bg-white p-4">
        <SidebarGroup>
          <div 
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer mb-10 border-4 border-black p-4 bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
             <h2 className="text-3xl font-black text-black font-heading leading-none uppercase">
                STUDY<br/>BUDDY
             </h2>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {items.map((item) => {
                const isActive = currentSet === item.url.split('=')[1];
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => router.push(item.url)}
                        className={`
                          cursor-pointer flex items-center gap-4 px-5 py-4 rounded-none
                          border-4 border-black transition-all duration-100 uppercase font-black
                          ${isActive 
                            ? `${item.bgColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]` 
                            : 'bg-white hover:bg-black hover:text-white'
                          }
                        `}
                      >
                        <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} strokeWidth={3} />
                        <span className="text-sm">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-3 h-3 bg-black border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-4 border-black bg-black text-white text-[10px] font-black uppercase text-center rotate-[2deg]">
             VIBE CHECK: PASSED ✅
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

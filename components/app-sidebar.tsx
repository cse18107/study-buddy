'use client';
import {Calendar, Settings, Newspaper, ChartNoAxesCombined, BookOpenCheck, Bot, GraduationCap} from "lucide-react";

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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Menu items with colors for learner-friendly design
const items = [
  {
    title: "Learn",
    url: "?set=learn",
    icon: GraduationCap,
    color: "text-purple-500",
    hoverColor: "hover:text-purple-600",
    bgColor: "hover:bg-purple-50",
    description: "Study your materials"
  },
  {
    title: "Chat",
    url: "?set=chat",
    icon: Bot,
    color: "text-cyan-500",
    hoverColor: "hover:text-cyan-600",
    bgColor: "hover:bg-cyan-50",
    description: "Ask AI for help"
  },
  {
    title: "Practice",
    url: "?set=practice",
    icon: BookOpenCheck,
    color: "text-blue-500",
    hoverColor: "hover:text-blue-600",
    bgColor: "hover:bg-blue-50",
    description: "Quiz yourself"
  },
  {
    title: "Exam",
    url: "?set=exam",
    icon: Calendar,
    color: "text-orange-500",
    hoverColor: "hover:text-orange-600",
    bgColor: "hover:bg-orange-50",
    description: "Test your knowledge"
  },
  {
    title: "Progress",
    url: "?set=progress",
    icon: ChartNoAxesCombined,
    color: "text-green-500",
    hoverColor: "hover:text-green-600",
    bgColor: "hover:bg-green-50",
    description: "Track your success"
  },
  {
    title: "Documents",
    url: "?set=documents",
    icon: Newspaper,
    color: "text-indigo-500",
    hoverColor: "hover:text-indigo-600",
    bgColor: "hover:bg-indigo-50",
    description: "Access materials"
  },
  {
    title: "Settings",
    url: "?set=settings",
    icon: Settings,
    color: "text-slate-500",
    hoverColor: "hover:text-slate-600",
    bgColor: "hover:bg-slate-50",
    description: "Customize experience"
  },
];

export function AppSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSet = searchParams?.get("set") || "learn";
  
  return (
    <Sidebar className="bg-white border-r border-slate-200">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel
            onClick={() => router.push("/")}
            className="cursor-pointer h-[100px] mb-4 hover:opacity-80 transition-opacity"
          >
            <Image 
              className="mx-auto" 
              src="/Full_logo.png" 
              alt="Study Buddy Logo" 
              width={300} 
              height={100} 
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = currentSet === item.url.split('=')[1];
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => router.push(item.url)}
                        className={`
                          cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl
                          transition-all duration-300 group
                          ${isActive 
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                            : `${item.bgColor} text-slate-700`
                          }
                        `}
                      >
                        <Icon className={`
                          w-5 h-5 transition-all duration-300
                          ${isActive 
                            ? 'text-white scale-110' 
                            : `${item.color} ${item.hoverColor} group-hover:scale-110`
                          }
                        `} />
                        <span className={`
                          font-medium transition-colors duration-300
                          ${isActive ? 'text-white font-semibold' : 'text-slate-700'}
                        `}>
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

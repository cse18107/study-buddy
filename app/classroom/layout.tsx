import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider className="bg-background">
      <AppSidebar />
      <main className="w-full">
        {/* <div className="absolute"><SidebarTrigger /></div> */}
        {children}
      </main>
    </SidebarProvider>
  );
}

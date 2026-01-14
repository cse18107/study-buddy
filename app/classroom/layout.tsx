import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <ProtectedRoute>
      <SidebarProvider className="bg-background">
        <AppSidebar />
        <main className="w-full">
          {/* <div className="absolute"><SidebarTrigger /></div> */}
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

import DashboardHeader from "@/components/shared/DashboardHeader";
import SidebarProvider from "@/providers/sidebar-provider";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <DashboardHeader />
        {children}
      </SidebarProvider>
    </>
  );
}

export default Layout;

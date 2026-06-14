import React from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <div className="[--header-height:calc(--spacing(14))] max-w-screen max-h-screen overflow-hidden">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 h-full w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="w-full h-[calc(100vh-56px)] overflow-scroll">
            <div className="flex flex-col p-6">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SidebarLayout;

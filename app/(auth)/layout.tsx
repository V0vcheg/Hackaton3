'use client';
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/AppSidebar";
import {Toaster} from "sonner";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

            <SidebarProvider>
                <AppSidebar/>
                <main className="flex-1 flex flex-col overflow-hidden h-screen">
                    <Toaster position={"top-right"}/>
                    <header className="mb-4 flex items-center justify-between p-4 bg-white shadow-sm h-15">
                        <SidebarTrigger/>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-60px)]">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
    );
}

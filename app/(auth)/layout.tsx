'use client';
import {SidebarProvider, SidebarTrigger, useSidebar} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/AppSidebar";
import {Toaster} from "sonner";
import { useDarkMode } from '@/hooks/useDarkMode';
import { Menu } from 'lucide-react';

function ToggleButton() {
    const { state } = useSidebar();
    
    // Position dynamique selon l'état de la sidebar
    const leftPosition = state === 'expanded' ? '17rem' : '1rem'; // 272px quand ouverte, 16px quand fermée
    
    return (
        <div 
            className="fixed top-4 z-50 transition-all duration-200"
            style={{ left: leftPosition }}
        >
            <SidebarTrigger 
                className="h-8 w-8 p-1.5 shadow-lg border transition-all duration-200 rounded-md bg-white dark:bg-[#2A1E3F] border-[#E5E5EA] dark:border-[#333333] text-[#222222] dark:text-[#F0F0F5]"
            >
                <Menu className="h-4 w-4" />
            </SidebarTrigger>
        </div>
    );
}

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <div className="bg-[#F8F7FB] dark:bg-[#1A1A22]">
            <SidebarProvider>
                <AppSidebar/>
                <main className="flex-1 flex flex-col overflow-hidden h-screen relative bg-[#F8F7FB] dark:bg-[#1A1A22]">
                    <Toaster position={"top-right"}/>
                    
                    {/* Bouton toggle avec position dynamique */}
                    <ToggleButton />
                    
                    <div className="flex-1 overflow-y-auto h-screen transition-colors duration-200 flex items-center justify-center bg-[#F8F7FB] dark:bg-[#1A1A22] pt-12 pb-4 px-6">
                        <div className="w-full max-w-7xl">
                            {children}
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}

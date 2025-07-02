'use client';
import React from 'react'
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "@/components/ui/sidebar";
import {Files, User, Settings} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {useLanguage} from "@/hooks/useLanguage";
import Image from 'next/image';

// Fonction globale pour vérifier les modifications
declare global {
  interface Window {
    checkUnsavedChanges?: () => Promise<boolean>
  }
}

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const {t} = useLanguage()
    
    const menuItems = [
        { icon: Files, label: t('fileManager'), href: '/files' },
        { icon: User, label: t('myProfile'), href: '/profile' },
        { icon: Settings, label: t('settings'), href: '/settings' },
    ]

    const isActive = (href: string) => pathname === href

    const handleNavigation = async (href: string) => {
        // Si on est déjà sur la page, ne rien faire
        if (href === pathname) return

        // Vérifier s'il y a des modifications non sauvegardées
        if (window.checkUnsavedChanges) {
            const canNavigate = await window.checkUnsavedChanges()
            if (!canNavigate) return
        }

        router.push(href)
    }

    return (
        <Sidebar 
            className="border-r border-[#5B21B6] dark:border-[#333333] bg-[#6D28D9] dark:bg-[#1A1A22]"
        >
            <SidebarHeader className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Image
                                src="/linkestiam-logo.png"
                                alt="LinkESTIAM"
                                width={40}
                                height={40}
                                className="object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white">
                            LinkESTIAM
                        </h2>
                    </div>
                </div>
            </SidebarHeader>

            <Separator className="bg-[#5B21B6] dark:bg-[#333333] h-px" />

            <SidebarContent className="px-3 py-4">
                <nav className="space-y-2" role="navigation">
                    {menuItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left
                                ${isActive(item.href) 
                                    ? 'bg-white dark:bg-[#8B5CF6] text-[#6D28D9] dark:text-white shadow-lg' 
                                    : 'text-white hover:bg-white/20 dark:hover:bg-white/10'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
                <div className="text-center text-xs text-white/90 dark:text-[#6D6D85]">
                    LinkESTIAM v1.0.0
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
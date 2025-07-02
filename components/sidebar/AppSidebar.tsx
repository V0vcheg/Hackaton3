'use client';
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader} from "@/components/ui/sidebar";
import Link from "next/link";
import {FilesIcon} from "lucide-react";
import GearIcon from "next/dist/client/components/react-dev-overlay/ui/icons/gear-icon";
import {usePathname} from "next/navigation";

type SidebarItem = {
    title: string;
    url: string;
    icon?: any
}
const SidebarItems: SidebarItem[] = [
    {
        title: 'File Manager',
        url: '/files',
        icon: FilesIcon
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: GearIcon
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup>
                    {SidebarItems.map((item) => {
                        const pathname = usePathname()
                        const isActive = pathname === item.url;
                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                className={`flex items-center gap-2 p-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? "bg-gray-200 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {item.icon && <item.icon className="h-4 w-4"/>}
                                {item.title}
                            </Link>
                        );
                    })}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TokenDisplay } from '@/components/token-display';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'File Uploads',
        href: '/file-upload',
        icon: LayoutGrid,
    },
    {
        title: 'All Forms',
        href: '/all-forms',
        icon: LayoutGrid,
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="py-2">
                    <TokenDisplay className="w-full justify-center" />
                </div>
                <SidebarSeparator className="mx-0" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

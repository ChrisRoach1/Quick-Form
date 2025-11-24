import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TokenDisplay } from '@/components/token-display';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, File, BookText, PlayCircle } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Content Generation',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Youtube Generation',
        href: '/youtube-generation',
        icon: PlayCircle,
    },
    {
        title: 'File Generation',
        href: '/file-upload',
        icon: BookText,
    },
    {
        title: 'All Forms',
        href: '/all-forms',
        icon: File,
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

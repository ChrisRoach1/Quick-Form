import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Coins } from 'lucide-react';
import { Button } from './ui/button';

interface TokenDisplayProps {
    variant?: 'default' | 'secondary' | 'outline';
    size?: 'sm' | 'default' | 'lg';
    showIcon?: boolean;
    className?: string;
}

export function TokenDisplay({ variant = 'secondary', size = 'default', showIcon = true, className = '' }: TokenDisplayProps) {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    // When sidebar is collapsed, show only the icon with tokens count
    const isCollapsed = state === 'collapsed';

    return (
        <div className="space-y-2">
            <Badge
                variant={variant}
                className={`inline-flex items-center font-medium transition-all duration-200 ${
                    isCollapsed ? 'min-w-0 justify-center gap-0.5 px-0 text-xs' : `gap-1.5 ${sizeClasses[size]}`
                } ${className}`}
            >
                {showIcon && <Coins className='h-3 w-3' />}
                <span className={isCollapsed ? 'font-semibold' : ''}>
                    {isCollapsed ? auth.tokens : `${auth.tokens} ${auth.tokens === 1 ? 'token' : 'tokens'}`}
                </span>
            </Badge>

            <Button
                onClick={() => window.location.href = route('checkout')}
                className={`inline-flex items-center font-medium transition-all duration-200 ${
                    isCollapsed ? 'min-w-0 justify-center gap-0.5 px-1 text-xs' : `gap-1.5 ${sizeClasses[size]}`
                } ${className}`}
            >
                {isCollapsed && <Coins className="h-3 w-3 shrink-0" />}
                <span className={isCollapsed ? 'font-semibold' : ''}>{isCollapsed ? '' : 'Buy Tokens'}</span>
            </Button>
        </div>
    );
}

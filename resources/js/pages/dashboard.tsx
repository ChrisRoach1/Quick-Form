import FormPrompt from '@/components/form-prompt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import YoutubeFormPrompt from '@/components/youtube-form-prompt';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface DashboardProps {
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ flash }: DashboardProps) {
    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }

        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.warning) {
            toast.warning(flash.warning);
        }

        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="w-full space-y-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Text Content & Generate
                            </CardTitle>
                            <CardDescription>
                                Paste your textbook content and provide any specific instructions for question generation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormPrompt />
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Text Content & Generate
                            </CardTitle>
                            <CardDescription>
                                Paste your textbook content and provide any specific instructions for question generation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <YoutubeFormPrompt />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

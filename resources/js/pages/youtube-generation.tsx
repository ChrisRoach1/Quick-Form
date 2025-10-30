import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import YoutubeFormPrompt from '@/components/youtube-form-prompt';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PlayCircle, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface YoutubeGenerationProps {
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Youtube Generation',
        href: '/youtube-generation',
    },
];

export default function YoutubeGeneration({ flash }: YoutubeGenerationProps) {
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
            <Head title="Youtube Generation" />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="w-full space-y-6">
                    <Alert variant="warning">
                        <TriangleAlert />
                        <AlertTitle>Video Length Limit</AlertTitle>
                        <AlertDescription>
                            Videos cannot be longer than 3 and a half minutes long. Please ensure your YouTube video is within this time limit.
                        </AlertDescription>
                    </Alert>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlayCircle className="h-5 w-5" />
                                YouTube Generation
                            </CardTitle>
                            <CardDescription>
                                Provide a YouTube URL and generate questions from the video content
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


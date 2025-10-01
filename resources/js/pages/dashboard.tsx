import FormPrompt from '@/components/form-prompt';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, FileText, Info, XCircle } from 'lucide-react';

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


    const getFlashAlert = () => {
        if (flash?.success) {
            return (
                <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.error) {
            return (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.warning) {
            return (
                <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{flash.warning}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.info) {
            return (
                <Alert variant="info">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{flash.info}</AlertDescription>
                </Alert>
            );
        }
        return null;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="w-full space-y-6">
                    {/* Flash Messages */}
                    {getFlashAlert()}
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
                </div>
            </div>
        </AppLayout>
    );
}

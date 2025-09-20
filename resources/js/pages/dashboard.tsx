import FormPrompt from '@/components/form-prompt';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, FileText, Info, Shield, XCircle } from 'lucide-react';

interface DashboardProps {
    hasGoogleAuth: boolean;
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

export default function Dashboard({ hasGoogleAuth, flash }: DashboardProps) {


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


    const authenticateWithGoogle = () => {
        window.location.href = route('google.auth');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="w-full space-y-6">
                    {/* Flash Messages */}
                    {getFlashAlert()}
                    {!hasGoogleAuth ? (
                        /* Authentication Required */
                        <Card className="mx-auto w-full max-w-md">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Authentication Required
                                </CardTitle>
                                <CardDescription>You need to authenticate with Google to create forms!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button onClick={authenticateWithGoogle} className="h-11 w-full text-base font-medium">
                                    Authenticate with Google
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Main Content */
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
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

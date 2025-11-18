import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { UserForm, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, Loader2, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import RemixFormModal from '@/components/remix-form-modal';

interface DashboardProps {
    generatedForms: UserForm[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Forms',
        href: '/all-forms',
    },
];


export default function AllForms({ generatedForms }: DashboardProps) {
    const [remixForm, setRemixForm] = useState<UserForm | null>(null);
    const [isRemixModalOpen, setIsRemixModalOpen] = useState(false);

    const handleRemixClick = (form: UserForm) => {
        setRemixForm(form);
        setIsRemixModalOpen(true);
    };

    const getStatusMeta = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    label: 'Completed',
                    variant: 'default' as const,
                    Icon: CheckCircle,
                    actionLabel: 'Open Form',
                };
            case 'processing':
                return {
                    label: 'Processing',
                    variant: 'default' as const,
                    Icon: Loader2,
                    actionLabel: 'In Progress',
                };
            case 'pending':
                return {
                    label: 'Pending',
                    variant: 'secondary' as const,
                    Icon: Clock,
                    actionLabel: 'Queued',
                };
            case 'failed':
                return {
                    label: 'Failed',
                    variant: 'destructive' as const,
                    Icon: XCircle,
                    actionLabel: 'Failed',
                };
            default:
                return {
                    label: status,
                    variant: 'secondary' as const,
                    Icon: Clock,
                    actionLabel: 'Queued',
                };
        }
    };

    const formatDateTime = (value: Date | string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Forms" />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="w-full space-y-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                All Generated Forms
                            </CardTitle>
                            <CardDescription>
                                Overview of your generated forms and their current processing status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!generatedForms || generatedForms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                                    <Clock className="h-6 w-6" />
                                    <div className="text-sm">No forms yet. Generate one from the dashboard to get started.</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {generatedForms?.map((form, index) => {
                                        const meta = getStatusMeta(form.status);
                                        const isInProgress = form.status === 'processing' || form.status === 'pending';
                                        return (
                                            <Card key={`${form.form_url}-${index}`} className="">
                                                <CardHeader className="gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant={meta.variant} className="gap-1">
                                                            <meta.Icon className={`h-3 w-3${meta.Icon === Loader2 ? ' animate-spin' : ''}`} />
                                                            {meta.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-base font-medium">
                                                        {form.title}
                                                    </div>
                                                    <CardDescription>
                                                        Created {formatDateTime(form.created_at)}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {form.status === 'completed' && form.form_url ? (
                                                            <Button asChild size="sm" className="gap-1" variant={'link'}>
                                                                <a href={form.form_url} target="_blank" rel="noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                    Open Form
                                                                </a>
                                                            </Button>
                                                        ) : (
                                                            <Button size="sm" variant={meta.variant} disabled className="gap-1">
                                                                {isInProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                                {meta.actionLabel}
                                                            </Button>
                                                        )}
                                                        {form.raw_output && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-1"
                                                                onClick={() => handleRemixClick(form)}
                                                            >
                                                                <RefreshCw className="h-4 w-4" />
                                                                Remix
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <RemixFormModal
                isOpen={isRemixModalOpen}
                onOpenChange={setIsRemixModalOpen}
                form={remixForm}
            />
        </AppLayout>
    );
}

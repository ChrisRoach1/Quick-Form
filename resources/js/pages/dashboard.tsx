import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileText, Shield, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

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
    const [textContent, setTextContent] = useState('');
    const [instructions, setInstructions] = useState('');


    const getFlashAlert = () => {
        if (flash?.success) {
            return (
                <Alert className="border-green-200 bg-green-50 text-green-800 relative">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.error) {
            return (
                <Alert className="border-red-200 bg-red-50 text-red-800 relative">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.warning) {
            return (
                <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 relative">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>{flash.warning}</AlertDescription>
                </Alert>
            );
        }
        if (flash?.info) {
            return (
                <Alert className="border-blue-200 bg-blue-50 text-blue-800 relative">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription>{flash.info}</AlertDescription>
                </Alert>
            );
        }
        return null;
    };

    const generate = () => {
        if (!textContent.trim()) {
            alert('Please enter some text content first');
            return;
        }

        router.post(route('generateOutline'), {
            textContent: textContent,
            instructions: instructions,
        })
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
                        <Card className="w-full max-w-md mx-auto">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Authentication Required
                                </CardTitle>
                                <CardDescription>
                                    You need to authenticate with Google to create forms and access Google Forms API
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    onClick={authenticateWithGoogle}
                                    className="h-11 w-full text-base font-medium"
                                >
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
                                <CardDescription>Paste your textbook content and provide any specific instructions for question generation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Text Content Section */}
                                <div className="space-y-2">
                                    <Label htmlFor="text-content">Textbook Content</Label>
                                    <Textarea
                                        id="text-content"
                                        placeholder="Paste your textbook content here. This can be chapters, sections, or any educational material you want to create test questions from..."
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        className="h-[300px] resize-none overflow-y-auto"
                                    />
                                </div>

                                {/* Instructions Section */}
                                <div className="space-y-2">
                                    <Label htmlFor="instructions">Instructions (Optional)</Label>
                                    <Textarea
                                        id="instructions"
                                        placeholder="Provide specific instructions for question generation, such as:
• Difficulty level (beginner, intermediate, advanced)
• Question types (multiple choice, short answer, essay)
• Tone and style preferences
• Focus areas or learning objectives
• Number of questions per chapter"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        className="h-[140px] resize-none overflow-y-auto"
                                    />
                                </div>

                                {/* Generate Button */}
                                <Button onClick={generate} className="h-11 w-full text-base font-medium" disabled={!textContent.trim()}>
                                    Generate Google Form
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

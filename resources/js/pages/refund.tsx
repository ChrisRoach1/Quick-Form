import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Refund() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Refund Policy - Quick Forms">
                <meta name="description" content="Refund Policy for Quick Forms" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                {/* Navigation */}
                <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-2">
                                <span className="mb-0.5 truncate leading-tight font-semibold text-2xl">Quick Forms</span>
                            </div>

                            <nav className="flex items-center space-x-4">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={route('home')}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Home
                                    </Link>
                                </Button>
                                {auth.user && (
                                    <Button asChild size="default">
                                        <Link href={route('dashboard')}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <section className="py-12 lg:py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Refund Policy
                            </h1>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground mb-8">
                                    Last updated: 14-Oct-2025
                                </p>

                                <div className="bg-background/60 backdrop-blur-sm rounded-lg border p-8 space-y-6">
                                    {/* Add your refund policy content here */}
                                    <p className="text-muted-foreground">
                                    we are committed to providing a unique and innovative experience through our AI-generated content.
                                    AI isn't perfect and we want you to be fully aware of the risk before making any purchases.
                                    Due to the high cost of generating this content, we unfortunately cannot offer refunds once credits have been used.
                                    We believe in transparency and want you to make an informed decision about our unique service. Your understanding and support mean a lot to us and we look forward to sharing
                                    new and exciting features in the future.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}





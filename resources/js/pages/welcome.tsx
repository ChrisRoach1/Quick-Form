import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Zap, Clock, CheckCircle, ArrowRight, BookOpen, Target, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const authenticateWithGoogle = () => {
        window.location.href = route('google-redirect');
    };
    return (
        <>
            <Head title="Google Form Generator - Streamline Test Creation for Teachers">
                <meta name="description" content="Transform textbook content into Google Form tests instantly. Perfect for teachers who want to create assessments quickly and efficiently." />
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
                                {auth.user ? (
                                    <Button asChild size="default">
                                        <Link href={route('dashboard')}>
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={authenticateWithGoogle}
                                        variant="outline"
                                        className="border-2"
                                    >
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Sign in with Google
                                    </Button>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <div className="text-center max-w-4xl mx-auto">
                            <Badge variant="secondary" className="mb-6 text-sm font-medium">
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI-Powered Assessment Creation
                            </Badge>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                                Transform Your Textbook Content into
                                <span className="text-primary block mt-2">Google Form Tests</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                                Save hours of work by automatically generating comprehensive test questions from your educational materials.
                                Perfect for teachers who want to focus on teaching, not test creation.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-foreground mb-2">90%</div>
                                    <div className="text-muted-foreground">Time Saved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-foreground mb-2">AI-Powered</div>
                                    <div className="text-muted-foreground">Question Generation</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-foreground mb-2">Instant</div>
                                    <div className="text-muted-foreground">Google Forms</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                Simple. Fast. Effective.
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Generate professional test questions in three easy steps
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">1. Paste Your Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        Simply copy and paste your textbook content, course materials, or any educational text into our platform.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="h-8 w-8 text-secondary-foreground" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">2. Set Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        Specify question types, difficulty levels, and focus areas to customize your test exactly how you want it.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Zap className="h-8 w-8 text-accent-foreground" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">3. Generate Forms</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        Our AI instantly creates comprehensive Google Forms ready for distribution to your students.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="bg-muted/20 py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                Everything You Need
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Powerful features designed specifically for educators
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Smart Content Analysis</h3>
                                    <p className="text-muted-foreground">AI analyzes your content to identify key concepts and generate relevant questions.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Multiple Question Types</h3>
                                    <p className="text-muted-foreground">Generate multiple choice, short answer, and essay questions automatically.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Instant Generation</h3>
                                    <p className="text-muted-foreground">Create comprehensive tests in seconds, not hours.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Custom Instructions</h3>
                                    <p className="text-muted-foreground">Tailor question difficulty, style, and focus areas to your needs.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Google Forms Integration</h3>
                                    <p className="text-muted-foreground">Seamlessly export to Google Forms for easy student distribution.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Any Subject</h3>
                                    <p className="text-muted-foreground">Works with textbooks and materials from any academic subject.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-background/80 backdrop-blur-sm py-8 mt-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Quick Forms. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <a
                                    href="https://app.termly.io/policy-viewer/policy.html?policyUUID=a281e2e6-164a-40b4-b00c-a035b3bd8dc1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </a>
                                <Link
                                    href={route('refund')}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Refund Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

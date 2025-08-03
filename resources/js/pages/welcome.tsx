import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Zap, Clock, CheckCircle, ArrowRight, BookOpen, Target, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

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
                                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-semibold text-foreground">FormGen</span>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={route('dashboard')}>
                                            Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Button variant="ghost" asChild>
                                            <Link href={route('login')}>
                                                Log in
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('register')}>
                                                Get Started
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
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

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                                {auth.user ? (
                                    <Button size="lg" className="text-lg px-8 py-6" asChild>
                                        <Link href={route('dashboard')}>
                                            <FileText className="mr-2 h-5 w-5" />
                                            Start Creating Tests
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="lg" className="text-lg px-8 py-6" asChild>
                                            <Link href={route('register')}>
                                                <FileText className="mr-2 h-5 w-5" />
                                                Start Free Trial
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                                            <Link href={route('login')}>
                                                Sign In
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

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
                <section className="bg-background py-24">
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

                {/* CTA Section */}
                <section className="bg-primary py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
                            Ready to Transform Your Test Creation?
                        </h2>
                        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                            Join hundreds of educators who have already streamlined their assessment process.
                        </p>

                        {auth.user ? (
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                                <Link href={route('dashboard')}>
                                    <FileText className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                                <Link href={route('register')}>
                                    <FileText className="mr-2 h-5 w-5" />
                                    Start Creating Tests Today
                                </Link>
                            </Button>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-secondary py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-semibold text-secondary-foreground">FormGen</span>
                            </div>
                            <p className="text-muted-foreground mb-6">
                                Streamlining test creation for educators worldwide.
                            </p>
                            <p className="text-sm text-muted-foreground/70">
                                © 2025 FormGen. Built for teachers, by teachers.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

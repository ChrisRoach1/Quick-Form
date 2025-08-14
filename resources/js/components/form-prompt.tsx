import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import {  router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    textContent: z.string().min(2, {
        message: 'provide some content!',
    }),
    tone: z.string(),
    instructions: z.string(),
});

export default function FormPrompt() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textContent: '',
            tone: '',
            instructions: '',
        },
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('generateOutline'), values);

        form.reset();
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="textContent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Text Content</FormLabel>
                        <FormControl>
                            <Textarea
                             placeholder="Paste your textbook content here. This can be chapters, sections, or any educational material you want to create test questions from..."
                             className="h-[300px] resize-none overflow-y-auto"
                            {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <FormControl>
                            <Input
                             placeholder="Define the tone for content retelling (e.g., professional, casual, academic, friendly)"
                             {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Custom Instructions</FormLabel>
                        <FormControl>
                            <Textarea
                             placeholder="Provide specific instructions for question generation"
                             className="h-[140px] resize-none overflow-y-auto"
                             {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="h-11 w-full text-base font-medium" disabled={!form.formState.isValid}>Generate Google Form</Button>
        </form>
    </Form>
    );
}

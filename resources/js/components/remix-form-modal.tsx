import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserForm } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

interface RemixFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    form: UserForm | null;
}



export default function RemixFormModal({ isOpen, onOpenChange, form }: RemixFormModalProps) {
    const formSchema = z.object({
        title: z.string().min(2, {message: 'title is required'}).default(form?.title === null || form?.title === undefined ? '' : `${form.title} (Remix)`).nonoptional(),
        rawOutput: z.string().default((form?.raw_output === null || form?.raw_output === undefined ? '' : form?.raw_output)).nonoptional(),
    });

    const remixForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });


    const handleClose = () => {
        onOpenChange(false);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        router.post(route('generateRemixForm'),
        {
            title: values.title,
            rawOutput: JSON.stringify(values.rawOutput)
        });
        remixForm.reset();
        router.flushAll();
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Remix Form</DialogTitle>
                    <DialogDescription>Edit the JSON data below to remix this form. {form?.title && `Form: ${form.title}`}</DialogDescription>
                </DialogHeader>

                <Form {...remixForm}>
                    <form onSubmit={remixForm.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={remixForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                        defaultValue={form?.title ? `${form?.title} (Remix)` : ''}
                                        placeholder="Enter a title for your remixed form" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={remixForm.control}
                            name="rawOutput"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Form Data (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            defaultValue={form?.raw_output ? JSON.stringify(form?.raw_output, null, 2) : ""}
                                            className="h-[400px] resize-none overflow-y-auto font-mono text-sm"
                                            placeholder="No form data available"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!remixForm.formState.isValid}>
                        Submit
                    </Button>
                </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

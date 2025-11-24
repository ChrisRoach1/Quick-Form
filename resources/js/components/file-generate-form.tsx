import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "./ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

interface FileGenerateFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fileName?: string;
    fileUploadId: number;
}



export default function FileGenerateForm({ isOpen, onOpenChange, fileName, fileUploadId }: FileGenerateFormProps) {
    const formSchema = z.object({
        title: z.string().min(2, {
            message: 'title is required',
        }),
        fileUploadId: z.number().default(fileUploadId).nonoptional(),
        pageStart: z.coerce.number<number>().min(1),
        pageEnd: z.coerce.number<number>().min(1),
        overridePrompt: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            pageStart: 1,
            pageEnd: 1,
            overridePrompt: '',
        },
    });

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        router.post(route('generate-from-file'), values);
        form.reset();
        router.flushAll();
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate Form</DialogTitle>
                    <DialogDescription>
                        Create a new form from { fileName }. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="Enter a title for your form" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pageStart"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Page Start</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pageEnd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Page End</FormLabel>
                                    <FormControl>
                                        <Input
                                        type='number'
                                            placeholder="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="overridePrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Override Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
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
                    <Button type="submit" disabled={!form.formState.isValid}>
                        Submit
                    </Button>
                </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

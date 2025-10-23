import { useForm } from "@inertiajs/react";
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
import { Label } from '@/components/ui/label';
import { Textarea } from "./ui/textarea";

interface FileGenerateFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fileName?: string;
}

export default function FileGenerateForm({ isOpen, onOpenChange, fileName }: FileGenerateFormProps) {
    const { data, setData, processing, errors, reset } = useForm<Required<{ pageStart: number, pageEnd: number, overridePrompt: string | null }>>({
        pageStart: 0,
        pageEnd: 0,
        overridePrompt: ''
    });

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="pageStart">Page Start</Label>
                        <Input
                            id="pageStart"
                            type="number"
                            placeholder="0"
                            min={0}
                            value={data.pageStart}
                            onChange={(e) => setData('pageStart', parseInt(e.target.value) || 0)}
                        />
                        {errors.pageStart && (
                            <p className="text-sm text-red-500">{errors.pageStart}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pageEnd">Page End</Label>
                        <Input
                            id="pageEnd"
                            type="number"
                            placeholder="0"
                            min={0}
                            value={data.pageEnd}
                            onChange={(e) => setData('pageEnd', parseInt(e.target.value) || 0)}
                        />
                        {errors.pageEnd && (
                            <p className="text-sm text-red-500">{errors.pageEnd}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="overridePrompt">Override Instructions</Label>
                        <Textarea
                            id="overridePrompt"
                            placeholder="Enter custom prompt (optional)"
                            value={data.overridePrompt || ''}
                            onChange={(e) => setData('overridePrompt', e.target.value || null)}
                        />
                        {errors.overridePrompt && (
                            <p className="text-sm text-red-500">{errors.overridePrompt}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Generating...' : 'Generate Form'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

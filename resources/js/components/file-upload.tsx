import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router, useForm } from '@inertiajs/react';
import { Upload, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRef } from 'react';


type fileUploadData = {
    file: File | null;
  }

export default function FileUpload() {
    const ref = useRef<HTMLInputElement>(null);
    const { data, setData, post, progress, processing, reset } = useForm<fileUploadData>({
        file: null,
      })

    const handleReset = () => {
        reset('file');
        if(ref.current){
            ref.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/upload', {
            onSuccess: () => {
                reset('file');
                if(ref.current){
                    ref.current.value = "";
                }
                router.flushAll();
            }
        })
    };

    return (
        <div className="flex flex-1 flex-col">
        <div className="w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload File
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="file-input" className="text-sm font-medium">
                                Select File
                            </label>
                            <Input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                className="cursor-pointer"
                                ref={ref}
                            />
                            <p className="text-xs text-muted-foreground">
                                Supported formats: PDF
                            </p>
                        </div>

                        {data.file && (
                            <Alert>
                                <AlertDescription>
                                    <strong>{data.file.name}</strong> ({(data?.file?.size / 1024 / 1024).toFixed(2)} MB)
                                    {progress?.upload}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 h-11 text-base font-medium"
                                disabled={!data.file || processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="h-5 w-5 animate-spin" />
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    'Upload File'
                                )}
                            </Button>
                            {data.file && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="h-11"
                                    disabled={processing}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
    );
}

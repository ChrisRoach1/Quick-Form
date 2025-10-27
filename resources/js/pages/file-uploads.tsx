import { useState } from 'react';
import FileUpload from "@/components/file-upload";
import FileGenerateForm from "@/components/file-generate-form";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { FileUploadData } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FileUploadProps {
    uploads: FileUploadData[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'File Upload',
        href: '/file-upload',
    },
];

export default function FileUploadsPage({uploads} : FileUploadProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileUploadData | null>(null);

    const handleGenerateClick = (upload: FileUploadData) => {
        setSelectedFile(upload);
        setIsModalOpen(true);
    };

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="File Upload" />
            <div className="p-6 space-y-3">
                <FileUpload/>
                <div className="rounded-lg border p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploads ? uploads.map((upload, index) => (
                                <TableRow key={index}>
                                    <TableCell>{upload?.file_name}</TableCell>
                                    <TableCell>
                                        {new Date(upload?.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGenerateClick(upload)}
                                        >
                                            Generate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : <></>}
                        </TableBody>
                    </Table>
                </div>
            </div>
            { selectedFile ?
            <FileGenerateForm
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            fileName={selectedFile?.file_name}
            fileUploadId={selectedFile.id}
        />
        :
        <></>
            }

        </AppLayout>
        )

}

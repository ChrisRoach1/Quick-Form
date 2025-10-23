<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

final class FileUploadController extends Controller
{
    public function index()
    {
        return Inertia::render('file-uploads',
        [
            'uploads' => auth()->user()->uploads()->orderByDesc('created_at')->get()
        ]);
    }

    public function store(Request $request): void
    {
        $path = Storage::disk('s3')->putFile('uploaded-documents', $request->file('file'));

        FileUpload::create([
            'user_id' => auth()->user()->id,
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);
    }
}

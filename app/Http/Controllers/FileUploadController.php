<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Jobs\GenerateFormFromFile;
use App\Models\FileUpload;
use App\Models\UserForm;
use App\Services\FormService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

final class FileUploadController extends Controller
{
    public function index()
    {
        return Inertia::render('file-uploads',
            [
                'uploads' => auth()->user()->uploads()->orderByDesc('created_at')->get(),
            ]);
    }

    public function store(Request $request)
    {
        $path = Storage::disk('s3')->putFile('uploaded-documents', $request->file('file'));

        FileUpload::create([
            'user_id' => auth()->user()->id,
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);

        return redirect('/file-upload')->with('success', 'File uploaded successfully!');
    }

    public function generateForm(Request $request, FormService $formService)
    {
        $request->validate([
            'title' => 'required|string|min:2',
            'fileUploadId' => 'required|integer',
        ]);

        $fileUpload = FileUpload::query()->where(['user_id' => auth()->user()->id, 'id' => $request->get('fileUploadId')])->first();

        if ($fileUpload) {

            $pendingUserForm = UserForm::create([
                'user_id' => auth()->user()->id,
                'title' => $request->get('title'),
                'text_content' => '',
                'prompt_instructions' => '',
                'status' => 'pending',
                'access_token' => auth()->user()->google_session,
            ]);

            auth()->user()->decrement('tokens', 1);

            GenerateFormFromFile::dispatch($pendingUserForm, $fileUpload, $request->get('pageStart'), $request->get('pageEnd'), $request->get('overridePrompt'));

            return redirect('/file-upload')->with('success', 'Your form is generating please check the forms page to see the status!');

        }

        return redirect('/file-upload')->with('error', 'Something went wrong, please try again later.');

    }
}

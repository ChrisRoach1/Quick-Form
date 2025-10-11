<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Jobs\GenerateForm;
use App\Models\UserForm;
use App\Services\FormService;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class FormController extends Controller
{
    public function index()
    {
        return Inertia::render('all-forms', [
            'generatedForms' => auth()->user()->userForm()->orderByDesc('created_at')->get(['status', 'form_url', 'created_at']),
        ]);
    }

    public function generateOutline(Request $request, FormService $formService)
    {
        $pendingUserForm = UserForm::create([
            'user_id' => auth()->user()->id,
            'text_content' => $request->get('textContent'),
            'prompt_instructions' => $request->get('instructions'),
            'prompt_rewrite_instructions' => $request->get('tone'),
            'status' => 'pending',
            'access_token' => auth()->user()->google_session,
        ]);

        auth()->user()->decrement('tokens', 1);

        GenerateForm::dispatch($pendingUserForm);

        return redirect('/dashboard')->with('success', 'Your form is generating please check the forms page to see the status!');
    }
}

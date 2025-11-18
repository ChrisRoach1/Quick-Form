<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Jobs\GenerateForm;
use App\Jobs\GenerateRemixForm;
use App\Jobs\GenerateYoutubeForm;
use App\Models\UserForm;
use App\Services\FormService;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class FormController extends Controller
{
    public function index()
    {
        return Inertia::render('all-forms', [
            'generatedForms' => auth()->user()->userForm()->orderByDesc('created_at')->get(['title', 'status', 'form_url', 'created_at', 'raw_output']),
        ]);
    }

    public function youtubeGenerationIndex()
    {
        return Inertia::render('youtube-generation');
    }

    public function dashboardIndex()
    {
        return Inertia::render('dashboard');
    }

    public function generateForm(Request $request)
    {
        $request->validate([
            'title' => 'required|string|min:2',
            'textContent' => 'required|string|min:2',
        ]);

        $pendingUserForm = UserForm::create([
            'user_id' => auth()->user()->id,
            'title' => $request->get('title'),
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

    public function generateRemixForm(Request $request)
    {

        $request->validate([
            'title' => 'required|string|min:2',
            'rawOutput' => 'required|string',
        ]);

        // Parse the JSON to ensure it's valid
        $rawOutput = json_decode($request->get('rawOutput'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return redirect('/all-forms')->with('error', 'Invalid JSON data provided.');
        }

        $pendingUserForm = UserForm::create([
            'user_id' => auth()->user()->id,
            'title' => $request->get('title'),
            'status' => 'pending',
            'text_content' => '',
            'raw_output' => $rawOutput,
            'access_token' => auth()->user()->google_session,
        ]);

        GenerateRemixForm::dispatch($pendingUserForm);

        return redirect('/all-forms')->with('success', 'Your remixed form is generating!');
    }

    public function generateYoutubeForm(Request $request)
    {

        $request->validate([
            'title' => 'required|string|min:2',
            'youtubeUrl' => 'required|url',
        ]);

        $pendingUserForm = UserForm::create([
            'user_id' => auth()->user()->id,
            'title' => $request->get('title'),
            'text_content' => '',
            'prompt_instructions' => $request->get('instructions'),
            'prompt_rewrite_instructions' => $request->get('tone'),
            'status' => 'pending',
            'access_token' => auth()->user()->google_session,
        ]);

        auth()->user()->decrement('tokens', 2);

        GenerateYoutubeForm::dispatch($pendingUserForm, $request->get('youtubeUrl'));

        return redirect('/dashboard')->with('success', 'Your form is generating please check the forms page to see the status!');
    }
}

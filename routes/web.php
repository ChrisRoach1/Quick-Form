<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Google\Client;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'hasGoogleAuth' => session()->has('google_access_token')
        ]);
    })->name('dashboard');

    Route::post('outline', [FormController::class, 'generateOutline'])->name('generateOutline');

});

// OAuth authorization route
Route::get('/google/auth', function () {
    $client = new Client();
    $client->setAuthConfig(base_path('client_secret_537945553436-9q1n3lp3q0pfi14j2j24d968i64u1m5o.apps.googleusercontent.com.json'));
    $client->addScope('https://www.googleapis.com/auth/forms.body');
    $client->addScope('https://www.googleapis.com/auth/drive');

    $authUrl = $client->createAuthUrl();
    return redirect($authUrl)->header('Access-Control-Allow-Origin', '*');
})->middleware(['auth', 'verified'])->name('google.auth');


// OAuth callback route
Route::get('/google/callback', function () {
    $client = new Client();
    $client->setAuthConfig(base_path('client_secret_537945553436-9q1n3lp3q0pfi14j2j24d968i64u1m5o.apps.googleusercontent.com.json'));
    if (request()->has('code')) {
        $code = request()->get('code');
        $accessToken = $client->fetchAccessTokenWithAuthCode($code);

        // Store the token in session for this demo
        session(['google_access_token' => $accessToken]);

        return redirect('/dashboard')->with('success', 'Authorized! Now you can create forms.');
    }

    return redirect('/')->with('error', 'Authorization failed');
})->middleware(['auth', 'verified'])->name('google.callback');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

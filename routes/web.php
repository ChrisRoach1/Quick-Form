<?php

use App\Http\Controllers\FormController;
use App\Services\GoogleOAuthService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Google\Client;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $oauthService = new GoogleOAuthService();
        $hasValidToken = $oauthService->getValidToken() !== null;
        
        return Inertia::render('dashboard', [
            'hasGoogleAuth' => $hasValidToken
        ]);
    })->name('dashboard');

    Route::post('outline', [FormController::class, 'generateOutline'])->name('generateOutline');

});

// OAuth authorization route
Route::get('/google/auth', function () {
    $oauthService = new GoogleOAuthService();
    $authUrl = $oauthService->getAuthUrl();
    return redirect($authUrl);
})->middleware(['auth', 'verified'])->name('google.auth');


// OAuth callback route
Route::get('/google/callback', function () {
    if (!request()->has('code')) {
        return redirect('/')->with('error', 'Authorization failed');
    }

    try {
        $oauthService = new GoogleOAuthService();
        $accessToken = $oauthService->handleCallback(request()->get('code'));
        session(['google_access_token' => $accessToken]);

        return redirect('/dashboard')->with('success', 'You\'re good to go!');
    } catch (\Exception $e) {
        \Log::error('OAuth callback error: ' . $e->getMessage());
        return redirect('/')->with('error', 'Authorization failed: ' . $e->getMessage());
    }
})->middleware(['auth', 'verified'])->name('google.callback');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

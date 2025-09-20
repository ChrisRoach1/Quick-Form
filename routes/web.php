<?php

use App\Http\Controllers\FormController;
use App\Models\PaidStripeSession;
use App\Services\GoogleOAuthService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Cashier\Cashier;

use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//primary app stuff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $oauthService = new GoogleOAuthService();
        $hasValidToken = $oauthService->getValidToken() !== null;
        
        return Inertia::render('dashboard', [
            'hasGoogleAuth' => $hasValidToken
        ]);
    })->name('dashboard');

    Route::get('all-forms', [FormController::class, 'index'])->name('all-forms');

    Route::post('outline', [FormController::class, 'generateOutline'])->name('generateOutline');
});


//stripe stuff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout-multi', function (Request $request) {
        $stripePriceId = env("STRIPE_PRICE_ID");
        $quantity = 1;

        return auth()->user()->checkout([$stripePriceId => $quantity], [
            'success_url' => route('checkout-multi-success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout-multi-cancel'),
        ]);
    })->name('checkout');

    Route::get('/checkout-multi/success', function(Request $request){
        $sessionId = $request->get('session_id');
        $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);
        $existingPaidSession = PaidStripeSession::where(['stripe_session_id'=> $sessionId, 'paid' => true])->first();
        $incrementAmount = env("TOKEN_INCREMENT_AMOUNT");

        if($session->payment_status === 'paid' && $existingPaidSession === null) {
            PaidStripeSession::create([
                'user_id' => auth()->user()->id,
                'stripe_session_id' => $sessionId,
                'paid' => true,
            ]);

            auth()->user()->increment('tokens', $incrementAmount);
        }else{
            PaidStripeSession::create([
                'user_id' => auth()->user()->id,
                'stripe_session_id' => $sessionId,
                'paid' => false,
            ]);
        }

        return redirect('dashboard');
    })->name('checkout-multi-success');

    Route::get('/checkout-multi/cancel', function(){
        return redirect('dashboard');
    })->name('checkout-multi-cancel');

});


//google auth stuff
Route::middleware(['auth', 'verified'])->group(function () {
    // OAuth authorization route
    Route::get('/google/auth', function () {
        $oauthService = new GoogleOAuthService();
        $authUrl = $oauthService->getAuthUrl();
        return redirect($authUrl);
    })->name('google.auth');


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
    })->name('google.callback');
});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

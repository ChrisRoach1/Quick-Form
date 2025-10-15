<?php

declare(strict_types=1);

use App\Http\Controllers\FormController;
use App\Models\PaidStripeSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Cashier\Cashier;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/refund', function () {
    return Inertia::render('refund');
})->name('refund');

// primary app stuff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('all-forms', [FormController::class, 'index'])->name('all-forms');

    Route::post('outline', [FormController::class, 'generateOutline'])->name('generateOutline');
});

// stripe stuff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout-multi', function (Request $request) {
        $stripePriceId = env('STRIPE_PRICE_ID');
        $quantity = 1;

        return auth()->user()->checkout([$stripePriceId => $quantity], [
            'success_url' => route('checkout-multi-success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout-multi-cancel'),
        ]);
    })->name('checkout');

    Route::get('/checkout-multi/success', function (Request $request) {
        $sessionId = $request->get('session_id');
        $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);
        $existingPaidSession = PaidStripeSession::where(['stripe_session_id' => $sessionId, 'paid' => true])->first();
        $incrementAmount = env('TOKEN_INCREMENT_AMOUNT');

        if ($session->payment_status === 'paid' && $existingPaidSession === null) {
            PaidStripeSession::create([
                'user_id' => auth()->user()->id,
                'stripe_session_id' => $sessionId,
                'paid' => true,
            ]);

            auth()->user()->increment('tokens', $incrementAmount);
        } else {
            PaidStripeSession::create([
                'user_id' => auth()->user()->id,
                'stripe_session_id' => $sessionId,
                'paid' => false,
            ]);
        }

        return redirect('dashboard');
    })->name('checkout-multi-success');

    Route::get('/checkout-multi/cancel', function () {
        return redirect('dashboard');
    })->name('checkout-multi-cancel');

});

// socialite stuff
Route::get('/auth/redirect', function () {
    return Socialite::driver('google')
        ->scopes(['https://www.googleapis.com/auth/forms.body'])
        ->redirect();
})->name('google-redirect');

Route::get('/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    $user = User::updateOrCreate([
        'google_id' => $googleUser->id,
    ], [
        'name' => $googleUser->name,
        'email' => $googleUser->email,
        'google_session' => $googleUser->token,
    ]);

    Auth::login($user);

    return redirect('/dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::middleware(['RapidAPI'])->group(function () {
    Route::post('/generatedForm', [App\Http\Controllers\APIGeneratedFormController::class, 'create']);
});

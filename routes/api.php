<?php

declare(strict_types=1);

use App\Http\Controllers\APIGeneratedFormController;
use Illuminate\Support\Facades\Route;

Route::middleware(['RapidAPI'])->group(function () {
    Route::post('/generatedForm', [APIGeneratedFormController::class, 'create']);

    Route::get('/generatedForm', [APIGeneratedFormController::class, 'getFormsById']);
});

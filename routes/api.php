<?php

use App\Http\Controllers\GeneratedFormController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['RapidAPI'])->group(function () {
    Route::post('/generatedForm', [\App\Http\Controllers\APIGeneratedFormController::class, 'create']);
});

<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GenerateAPIFormAction;
use App\Models\RapidGeneratedForm;
use App\Services\FormService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

final class APIGeneratedFormController extends Controller
{
    public function create(Request $request, FormService $formService, GenerateAPIFormAction $generateFormAction)
    {
        $validator = Validator::make($request->all(),
            rules: [
                'text_content' => 'required | string',
                'prompt_instructions' => 'nullable |sometimes|string',
                'external_id' => 'sometimes|uuid',
            ]
        );

        if ($validator->fails()) {
            $errorMessage = $validator->errors()->first();
            $response = [
                'message' => $errorMessage,
            ];

            return response()->json($response, 400);
        }

        return $generateFormAction->handle($request, $formService);
    }

    public function getFormsById(string $id)
    {
        $generatedForms = RapidGeneratedForm::query()->where('external_id', $id)->get(['form_url', 'created_at']);

        return response()->json(['forms' => $generatedForms], 200);

    }
}

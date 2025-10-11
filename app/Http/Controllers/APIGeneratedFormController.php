<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GenerateAPIFormAction;
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
                'status' => false,
                'message' => $errorMessage,
            ];

            return response()->json($response, 400);
        }

        return $generateFormAction->handle($request, $formService);
    }
}

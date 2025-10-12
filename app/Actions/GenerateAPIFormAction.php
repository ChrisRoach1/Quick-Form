<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\RapidGeneratedForm;
use App\Services\FormService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

final readonly class GenerateAPIFormAction
{
    /**
     * Execute the action.
     */
    public function handle(Request $request, FormService $formService): JsonResponse
    {
        try {
            $accessToken = $request->header('Google-Access-Token');

            Log::info('Starting form generation');

            $formService->SetAccessToken($accessToken);

            Log::info('Generating form outline...');
            $structuredResponse = $formService->GenerateFormOutline($request->get('text_content'), $request->get('prompt_instructions'));

            Log::info('Verifying questions...');
            $structuredVerificationResponse = $formService->VerifyQuestions($request->get('text_content'), $structuredResponse);

            Log::info('Creating Google Form...');
            $formId = $formService->CreateForm($structuredResponse['title']);

            $questionListText = 'RAW QUESTION LIST: ';

            Log::info('Adding fill-in-the-blank questions...');
            foreach ($structuredResponse['FillInTheBlankQuestions'] as $question) {
                $questionText = $question[0];
                $answer = $question[1];

                foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion) {
                    if ($problemQuestion[0] === $questionText) {
                        $answer = $problemQuestion[1];
                    }
                }

                $questionListText .= '; '.$questionText;
                $formService->addTextQuestion($formId, $questionText, $answer, true);
            }

            Log::info('Adding multiple choice questions...');
            foreach ($structuredResponse['MultipleChoiceQuestions'] as $question) {
                $questionText = $question[0];
                $choices = array_slice($question, 1, 4);
                $answer = $question[5];

                foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion) {
                    if ($problemQuestion[0] === $questionText) {
                        $answer = $problemQuestion[1];
                    }
                }

                $questionListText .= '; '.$questionText;
                $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer, true);
            }

            Log::info('Adding yes/no questions...');
            foreach ($structuredResponse['YesNoChoiceQuestions'] as $question) {
                $questionText = $question[0];
                $choices = array_slice($question, 1, 2);
                $answer = $question[3];

                foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion) {
                    if ($problemQuestion[0] === $questionText) {
                        $answer = $problemQuestion[1];
                    }
                }

                $questionListText .= '; '.$questionText;
                $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer, true);
            }

            Log::info('Generating form description...');
            $description = $formService->GenerateDescription($request->get('text_content'), $questionListText, null);
            $formService->SetFormDescription($formId, $description);

            Log::info('Getting form URL...');
            $formUrl = $formService->formsService->forms->get($formId)->responderUri;

            Log::info('Form generation completed successfully');

            RapidGeneratedForm::create([
                'text_content' => $request->get('text_content'),
                'prompt_instructions' => $request->get('prompt_instructions'),
                'form_url' => $formUrl,
                'external_id' => request()->get('external_id'),
            ]);

            return response()->json(['formUrl' => $formUrl], 200);

        } catch (Exception $ex) {
            Log::error('Form generation failed - Error: '.$ex->getMessage());

            return response()->json(['error' => $ex->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\FormService;
use Google\Service\Exception;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Illuminate\Http\Request;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

class FormController extends Controller
{


    public function index()
    {

    }

    public function generateOutline(Request $request, FormService $formService)
    {
        $structuredResponse = $formService->GenerateFormOutline($request->get('textContent'), $request->get('instructions'));

        $structuredVerificationResponse = $formService->VerifyQuestions($request->get('textContent'), $structuredResponse);

        $formId = $formService->CreateForm($structuredResponse['title']);

        $questionListText = 'RAW QUESTION LIST: ';

        foreach ($structuredResponse['FillInTheBlankQuestions'] as $question)
        {

            $questionText = $question[0];
            $answer = $question[1];

            foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion){
                if($problemQuestion[0] === $questionText){
                    $answer = $problemQuestion[1];
                }
            }

            $questionListText = $questionListText . '; ' .$questionText;
            $formService->addTextQuestion($formId, $questionText,$answer,true);
        }

        foreach ($structuredResponse['MultipleChoiceQuestions'] as $question)
        {
            $questionText = $question[0];
            $choices = array_slice($question, 1, 5);
            $answer = $question[6];

            foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion){
                if($problemQuestion[0] === $questionText){
                    $answer = $problemQuestion[1];
                }
            }

            $questionListText = $questionListText . '; ' .$questionText;
            $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer,true);
        }

        foreach ($structuredResponse['YesNoChoiceQuestions'] as $question)
        {
            $questionText = $question[0];
            $choices = array_slice($question, 1, 2);
            $answer = $question[3];

            foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion){
                if($problemQuestion[0] === $questionText){
                    $answer = $problemQuestion[1];
                }
            }

            $questionListText = $questionListText . '; ' . $questionText;
            $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer,true);
        }

        $description = $formService->GenerateDescription($request->get('textContent'), $questionListText);

        $formService->SetFormDescription($formId, $description);


        try {
            return redirect('/dashboard')->with('success', $formService->formsService->forms->get($formId)->responderUri);
        } catch (Exception $e) {
            return redirect('/dashboard')->with('error', 'Something went wrong, please try again later.');
        }

    }
}

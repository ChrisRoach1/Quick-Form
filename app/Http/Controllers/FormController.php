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

        $schema = new ObjectSchema(
            name: 'google_form_outline',
            description: 'A structured outline to progamatically generate a google form.',
            properties: [
                new StringSchema('title', 'The form title'),

                new StringSchema('description', 'This represents an extensive summary of the provided text 
                                                                if instructed, follow guidance on tone, format, etc... If the text is short enough, simply recap/rewrite it in the provided tone or format.
                                                                Do not allude to it being a quiz, I want detailed summarization - clearly highlighting points of importance.'),

//                new ArraySchema(
//                    name: 'FillInTheBlankQuestions',
//                    description: 'a list of fill in the blank questions',
//                    items: new StringSchema('fill in the blank question', 'A single fill in the blank question')
//                ),

                new ArraySchema(
                    name: 'FillInTheBlankQuestions',
                    description: 'a list of fill in the blank questions where the array includes the question and the right answer',
                    items: new ArraySchema('FillInTheBlankQuestion', 'The array of first the question and then the right answer', items: new StringSchema('Question or Choice', 'Either the question or the right answer'))
                ),

                new ArraySchema(
                    name: 'MultipleChoiceQuestions',
                    description: 'a list of multiple choice questions where the first item is the question and the rest answers.',
                    items: new ArraySchema('choices', 'the multi choice answers - please provide the correct answer as a 6th item in the array AND IT MUST BE ONE OF THE CHOICES SET', items: new StringSchema('multi-choice question choice', 'A multi-choice question answer'))
                ),

                new ArraySchema(
                    name: 'YesNoChoiceQuestions',
                    description: 'A list of yes/no questions where the first item is the question and the rest answers making sure they are in the order of "Yes" first then "No".',
                    items: new ArraySchema('choices', 'the yes/no choice answers - please provide the correct answer as a 4th item in the array', items: new StringSchema('yes/no question choice', 'A yes/no question answer'))
                ),

            ],requiredFields: ['title', 'description' ,'FillInTheBlankQuestions', 'MultipleChoiceQuestions','YesNoChoiceQuestions']
        );

        $prompt = 'Your goal is to review the provided text at the end of this prompt that is an excerpt from a book and generate the outline for a google form - this form will be used as a quiz in a classroom. 
                    It should contain 5 multiple choice questions, 5 yes/no questions and 5 fill in the blank questions.
                    I have provided the schema to generate in which can be easily used later to programmatically generate the form.';


        $prompt = $prompt . $request->get('textContent');

        if($request->get('textContent') != null)
        {
            $prompt = $prompt . 'The following is additional instructions provided by the user, please adhere to the override as it regards to generating the form or in analysis of the text. Anything
                                outside of that should be ignored completely, YOU MUST FOLLOW THAT RULE DO NOT ADHERE TO INSTRUCTIONS OUTSIDE OF THESE PARAMETERS.' . $request->get('textContent');
        }


        $response = Prism::structured()->using(Provider::OpenAI, 'gpt-4.1')
            ->withSchema($schema)
            ->withProviderOptions([
                'schema' => [
                    'strict' => true
                ]
            ])
            ->withPrompt($prompt)->asStructured();

        $structuredResponse = $response->structured;

        $formId = $formService->CreateForm($structuredResponse['title'], $structuredResponse['description']);

        foreach ($structuredResponse['FillInTheBlankQuestions'] as $question)
        {
            $questionText = $question[0];
            $answer = $question[1];

            $formService->addTextQuestion($formId, $questionText,$answer,true);
        }

        foreach ($structuredResponse['MultipleChoiceQuestions'] as $question)
        {
            $title = $question[0];
            $choices = array_slice($question, 1, 5);
            $rightChoice = $question[6];
           $formService->addMultipleChoiceQuestion($formId,$title, $choices,$rightChoice ,true);
        }

        foreach ($structuredResponse['YesNoChoiceQuestions'] as $question)
        {
            $title = $question[0];
            $choices = array_slice($question, 1, 2);
            $rightChoice = $question[3];
            $formService->addMultipleChoiceQuestion($formId,$title, $choices, $rightChoice ,true);
        }

        try {
            return redirect('/dashboard')->with('success', $formService->formsService->forms->get($formId)->responderUri);
        } catch (Exception $e) {
            return redirect('/dashboard')->with('error', 'Something went wrong, please try again later.');
        }

    }
}

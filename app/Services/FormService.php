<?php

declare(strict_types=1);

namespace App\Services;

use Exception;
use Google\Client;
use Google\Service\Forms;
use Google\Service\Forms\BatchUpdateFormRequest;
use Google\Service\Forms\CreateItemRequest;
use Google\Service\Forms\Form;
use Google\Service\Forms\Item;
use Google\Service\Forms\Question;
use Google\Service\Forms\QuestionItem;
use Google\Service\Forms\Request as FormsRequest;
use Google\Service\Forms\TextQuestion;
use Google\Service\Forms\UpdateFormInfoRequest;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class FormService
{
    /**
     * @var Client
     */
    public $client;

    /**
     * @var Forms
     */
    public $formsService;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Exception
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->formsService = new Forms($this->client);
    }

    public function SetAccessToken($accessToken): void
    {
        $this->client->setAccessToken($accessToken);
    }

    public function CreateForm($formTitle): string
    {

        $formInfo = new Forms\Info();
        $formInfo->setTitle($formTitle);
        $form = new Form();
        $form->setInfo($formInfo);
        $createdFormId = $this->formsService->forms->create($form);

        // Enable quiz settings
        $formSettings = new Forms\FormSettings();
        $quizSettings = new Forms\QuizSettings();
        $quizSettings->setIsQuiz(true);
        $formSettings->setQuizSettings($quizSettings);

        $updateSettingsRequest = new Forms\UpdateSettingsRequest([
            'settings' => $formSettings,
            'updateMask' => 'quizSettings.isQuiz',
        ]);

        $settingsRequest = new FormsRequest([
            'updateSettings' => $updateSettingsRequest,
        ]);

        $batchRequest = new BatchUpdateFormRequest([
            'requests' => [$settingsRequest],
        ]);

        $this->formsService->forms->batchUpdate($createdFormId->formId, $batchRequest);

        return $createdFormId->formId;
    }

    public function SetFormDescription($formId, $description): void
    {
        $updateFormInfoRequest = new UpdateFormInfoRequest([
            'info' => new Forms\Info(['description' => $description]),
            'updateMask' => 'description',
        ]);

        $infoRequest = new FormsRequest([
            'updateFormInfo' => $updateFormInfoRequest,
        ]);

        $batchRequest = new BatchUpdateFormRequest([
            'requests' => [$infoRequest],
        ]);

        $this->formsService->forms->batchUpdate($formId, $batchRequest);
    }

    public function addTextQuestion($formId, $title, $correctAnswer, $required = false)
    {
        $textQuestion = new TextQuestion();
        $textQuestion->setParagraph(false);

        $correctAnswer = new Forms\CorrectAnswer([
            'value' => $correctAnswer,
        ]);

        $correctAnswers = new Forms\CorrectAnswers([
            'answers' => [$correctAnswer],
        ]);

        $grading = new Forms\Grading([
            'pointValue' => 1,
            'correctAnswers' => $correctAnswers,
        ]);
        $question = new Question([
            'textQuestion' => $textQuestion,
            'required' => $required,
            'grading' => $grading,
        ]);

        $questionItem = new QuestionItem([
            'question' => $question,
        ]);

        $item = new Item([
            'title' => $title,
            'questionItem' => $questionItem,
        ]);

        $createItemRequest = new CreateItemRequest([
            'item' => $item,
            'location' => ['index' => 0],
        ]);

        $formsRequest = new FormsRequest([
            'createItem' => $createItemRequest,
        ]);

        $request = new BatchUpdateFormRequest([
            'requests' => [$formsRequest],
        ]);

        return $this->formsService->forms->batchUpdate($formId, $request);
    }

    public function addMultipleChoiceQuestion($formId, $title, $options, $rightChoice, $required = false)
    {

        $choiceQuestion = new Forms\ChoiceQuestion([
            'type' => 'RADIO',
            'options' => array_map(fn ($option): array => ['value' => mb_trim((string) $option)], $options),
        ]);

        $correctAnswer = new Forms\CorrectAnswer([
            'value' => $rightChoice,
        ]);

        $correctAnswers = new Forms\CorrectAnswers([
            'answers' => [$correctAnswer],
        ]);

        $grading = new Forms\Grading(
            [
                'pointValue' => 1,
                'correctAnswers' => $correctAnswers,
            ]
        );

        $question = new Question([
            'choiceQuestion' => $choiceQuestion,
            'required' => $required,
            'grading' => $grading,
        ]);

        $questionItem = new QuestionItem([
            'question' => $question,
        ]);

        $item = new Item([
            'title' => $title,
            'questionItem' => $questionItem,
        ]);

        $createItemRequest = new CreateItemRequest([
            'item' => $item,
            'location' => ['index' => 0],
        ]);

        $formsRequest = new FormsRequest([
            'createItem' => $createItemRequest,
        ]);

        $request = new BatchUpdateFormRequest([
            'requests' => [$formsRequest],
        ]);

        return $this->formsService->forms->batchUpdate($formId, $request);
    }

    public function GenerateDescription(string $textToSummarize, string $rawQuestionList, ?string $toneOverride): string
    {

        $descriptionPrompt = '  I want you to summarize/retell the text that follows - it should be done in a more modern way that the youth can understand. 
                                I will also provide a raw output of questions from a quiz, you should retell the text in such a way that students can easily answer the questions without needing external resources. 
                                DO NOT ADD ANY BULLETED LIST OF POINTS TO FOLLOW. 
                                WRITE ONLY A SUMMARY. 
                                YOU NEED TO MAKE SURE THE SUMMARY INCLUDES RELEVANT POINTS AS IT RELATES TO THE QUESTIONS BEING ASKED. 
                                THE STUDENTS MUST BE ABLE TO READ THE RETELLING AND FIND THE ANSWERS. 
                                THIS IS THE MOST IMPORTANT PART OF THE RETELLING DO NOT SCREW THIS UP.';

        $descriptionPrompt = $descriptionPrompt.'TEXT: '.$textToSummarize.$rawQuestionList;

        if ($toneOverride !== null) {
            $descriptionPrompt = $descriptionPrompt.'the following will represent a tone override - the retelling should follow as instructed. This could be in the tone of a given author, an example text, etc..
                                                    follow the override only in regards to the retelling - nothing else.  TONE OVERRIDE: '.$toneOverride;
        }

        $descriptionResponse = Prism::text()->using(Provider::OpenAI, 'gpt-4.1-mini')
            ->withPrompt($descriptionPrompt)->asText();

        return $descriptionResponse->text;
    }

    public function VerifyQuestions(string $textContent, $structuredQuestionResponse): ?array
    {
        $verificationSchema = new ObjectSchema(
            name: 'google_form_outline_verification',
            description: 'A structured outline to programmatically verify accuracy on the google forms outline.',
            properties: [
                new ArraySchema(
                    name: 'problemQuestions',
                    description: 'A list of incorrect questions with the right answer listed',
                    items: new ArraySchema('problemQuestions', 'The list of problem questions where the first item is the question text and the second is the right answer', items: new StringSchema('Question or Choice', 'Either the question or the right answer'))
                ),
            ], requiredFields: ['problemQuestions']
        );

        $verificationPrompt = 'I want you to verify the following questions are correct and if they are not correct please provide the correct answer.
                                THE CORRECT ANSWER MUST BE ONE OF THE EXISTING OPTIONS.
                                The questions should be in the same order as the questions in the google form.
                                The questions are based around the text that follows: '.$textContent.
                                'The following is the raw structured output for the form outline: '.json_encode($structuredQuestionResponse);

        $verificationResponse = Prism::structured()->using(Provider::OpenAI, 'gpt-4.1-mini')
            ->withSchema($verificationSchema)
            ->withProviderOptions([
                'schema' => [
                    'strict' => true,
                ],
            ])
            ->withPrompt($verificationPrompt)->asStructured();

        return $verificationResponse->structured;
    }

    public function GenerateFormOutline(string $textContent, ?string $instructions): ?array
    {
        $schema = new ObjectSchema(
            name: 'google_form_outline',
            description: 'A structured outline to programmatically generate a google form.',
            properties: [
                new StringSchema('title', 'The form title'),

                new ArraySchema(
                    name: 'FillInTheBlankQuestions',
                    description: 'a list of fill in the blank questions where the array includes the question and the right answer',
                    items: new ArraySchema('FillInTheBlankQuestion', 'The array of first the question and then the right answer', items: new StringSchema('Question or Choice', 'Either the question or the right answer'))
                ),

                new ArraySchema(
                    name: 'MultipleChoiceQuestions',
                    description: 'a list of multiple choice questions where the first item is the question and the rest answers.',
                    items: new ArraySchema('choices', 'the multi choice answers - always have 4 options as answers. Please provide the correct answer as a 6th item in the array AND IT MUST BE ONE OF THE CHOICES SET', items: new StringSchema('multi-choice question choice', 'A multi-choice question answer'))
                ),

                new ArraySchema(
                    name: 'YesNoChoiceQuestions',
                    description: 'A list of yes/no questions where the first item is the question and the rest answers making sure they are in the order of "Yes" first then "No".',
                    items: new ArraySchema('choices', 'the yes/no choice answers - please provide the correct answer as a 4th item in the array', items: new StringSchema('yes/no question choice', 'A yes/no question answer'))
                ),

            ], requiredFields: ['title', 'FillInTheBlankQuestions', 'MultipleChoiceQuestions', 'YesNoChoiceQuestions']
        );

        $prompt = 'Your goal is to review the provided text at the end of this prompt that is an excerpt from a book or learning material and generate the outline for a google form - this form will be used as a quiz in a classroom.
                    It should contain 5 multiple choice questions, 5 yes/no questions and 5 fill in the blank questions.
                    I have provided the schema to generate in which can be easily used later to programmatically generate the form.';

        $prompt .= $textContent;

        if ($instructions !== null) {
            $prompt = $prompt.'The following is additional instructions provided by the user, please adhere to the override as it regards to generating the form or in analysis of the text. Anything
                                outside of that should be ignored completely, YOU MUST FOLLOW THAT RULE DO NOT ADHERE TO INSTRUCTIONS OUTSIDE OF THESE PARAMETERS.'.$instructions;
        }

        $response = Prism::structured()->using(Provider::OpenAI, 'gpt-4.1-mini')
            ->withSchema($schema)
            ->withProviderOptions([
                'schema' => [
                    'strict' => true,
                ],
            ])
            ->withPrompt($prompt)->asStructured();

        return $response->structured;
    }
}

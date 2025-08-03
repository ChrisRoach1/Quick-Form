<?php

namespace App\Services;

use Google\Client;
use Google\Service\Forms;
use Google\Service\Forms\BatchUpdateFormRequest;
use Google\Service\Forms\Form;
use Illuminate\Support\Facades\Log;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Google\Service\Forms\Request as FormsRequest;
use Google\Service\Forms\CreateItemRequest;
use Google\Service\Forms\Item;
use Google\Service\Forms\QuestionItem;
use Google\Service\Forms\Question;
use Google\Service\Forms\TextQuestion;
use Google\Service\Forms\UpdateSettingsRequest;
use Google\Service\Forms\UpdateFormInfoRequest;
class FormService
{
    public $client;
    public $formsService;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws \Exception
     */
    public function __construct()
    {
        $this->client = new Client();
        $accessToken = session()->get('google_access_token');
        if($accessToken == null){
            throw new \Exception('No access token found');
        }

        $this->client->setAccessToken($accessToken);
        $this->formsService = new Forms($this->client);

    }

    public function CreateForm($formTitle, $description): string
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
            'updateMask' => 'quizSettings.isQuiz'
        ]);

        $updateFormInfoRequest = new UpdateFormInfoRequest([
            'info' => new Forms\Info(['description' => $description]),
            'updateMask' => 'description'
        ]);

        $settingsRequest = new FormsRequest([
            'updateSettings' => $updateSettingsRequest
        ]);

        $infoRequest = new FormsRequest([
            'updateFormInfo' => $updateFormInfoRequest
        ]);

        $batchRequest = new BatchUpdateFormRequest([
            'requests' => [$settingsRequest, $infoRequest]
        ]);

        $this->formsService->forms->batchUpdate($createdFormId->formId, $batchRequest);

        return $createdFormId->formId;
    }

    public function addTextQuestion($formId, $title, $correctAnswer, $required = false)
    {
        $textQuestion = new TextQuestion();
        $textQuestion->setParagraph(false);

        $correctAnswer = new \Google\Service\Forms\CorrectAnswer([
            'value' => $correctAnswer
        ]);

        $correctAnswers = new \Google\Service\Forms\CorrectAnswers([
            'answers' => [$correctAnswer]
        ]);

        $grading = new \Google\Service\Forms\Grading([
            'pointValue' => 1,
            'correctAnswers' => $correctAnswers
        ]);
        $question = new Question([
            'textQuestion' => $textQuestion,
            'required' => $required,
            'grading' => $grading,
        ]);

        $questionItem = new QuestionItem([
            'question' => $question
        ]);

        $item = new Item([
            'title' => $title,
            'questionItem' => $questionItem
        ]);

        $createItemRequest = new CreateItemRequest([
            'item' => $item,
            'location' => ['index' => 0]
        ]);

        $formsRequest = new FormsRequest([
            'createItem' => $createItemRequest
        ]);

        $request = new BatchUpdateFormRequest([
            'requests' => [$formsRequest]
        ]);

        return $this->formsService->forms->batchUpdate($formId, $request);
    }

    public function addMultipleChoiceQuestion($formId, $title, $options, $rightChoice ,$required = false)
    {

        $choiceQuestion = new \Google\Service\Forms\ChoiceQuestion([
            'type' => 'RADIO',
            'options' => array_map(function($option) {
                return ['value' => trim($option)];
            }, $options)
        ]);

        $correctAnswer = new \Google\Service\Forms\CorrectAnswer([
            'value' => $rightChoice
        ]);

        $correctAnswers = new \Google\Service\Forms\CorrectAnswers([
            'answers' => [$correctAnswer]
        ]);

        $grading = new \Google\Service\Forms\Grading(
            [
                'pointValue' => 1,
                'correctAnswers' => $correctAnswers
            ]
        );

        $question = new Question([
            'choiceQuestion' => $choiceQuestion,
            'required' => $required,
            'grading' => $grading,
        ]);

        $questionItem = new QuestionItem([
            'question' => $question
        ]);

        $item = new Item([
            'title' => $title,
            'questionItem' => $questionItem
        ]);

        $createItemRequest = new CreateItemRequest([
            'item' => $item,
            'location' => ['index' => 0]
        ]);

        $formsRequest = new FormsRequest([
            'createItem' => $createItemRequest
        ]);

        $request = new BatchUpdateFormRequest([
            'requests' => [$formsRequest]
        ]);

        return $this->formsService->forms->batchUpdate($formId, $request);
    }
}

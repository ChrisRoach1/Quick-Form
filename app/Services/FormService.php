<?php

namespace App\Services;

use Google\Client;
use Google\Service\Forms;
use Google\Service\Forms\BatchUpdateFormRequest;
use Google\Service\Forms\Form;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Google\Service\Forms\Request as FormsRequest;
use Google\Service\Forms\CreateItemRequest;
use Google\Service\Forms\Item;
use Google\Service\Forms\QuestionItem;
use Google\Service\Forms\Question;
use Google\Service\Forms\TextQuestion;
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

    public function CreateForm($formTitle): string
    {

        $formInfo = new Forms\Info();
        $formInfo->setTitle($formTitle);
        $form = new Form();
        $form->setInfo($formInfo);
        $createdFormId = $this->formsService->forms->create($form);

        return $createdFormId->formId;
    }

    public function addTextQuestion($formId, $title, $required = false)
    {
        $textQuestion = new TextQuestion();

        $question = new Question([
            'textQuestion' => $textQuestion,
            'required' => $required
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

    public function addMultipleChoiceQuestion($formId, $title, $options, $required = false)
    {
        $choiceQuestion = new \Google\Service\Forms\ChoiceQuestion([
            'type' => 'RADIO',
            'options' => array_map(function($option) {
                return ['value' => $option];
            }, $options)
        ]);

        $question = new Question([
            'choiceQuestion' => $choiceQuestion,
            'required' => $required
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

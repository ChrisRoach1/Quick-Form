<?php

namespace App\Jobs;

use App\Models\UserForm;
use App\Services\FormService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\ValueObjects\Media\Video;

class GenerateYoutubeForm implements ShouldQueue
{
    use Queueable;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 360;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(public UserForm $userForm, public string $youtubeUrl)
    {
        //
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [30, 60, 120]; // Wait 30s, then 60s, then 120s between retries
    }

    /**
     * Execute the job.
     */
    public function handle(FormService $formService): void
    {
        try {

            $response = Prism::text()
                ->using(Provider::Gemini, 'gemini-2.5-pro')
                ->withMaxTokens(2173197)
                ->withPrompt(
                    'transcribe the content of this video in such a way that it could be used later as the summary for a quiz in a classroom. For more context, 
                    the quiz will be that in a google form where the description is the transcription and questions are generated from it. DO NOT PROVIDE A LIST OF POTENTIAL QUESTIONS. Be verbose when it makes sense.
                    Leave out any sort of explanation of what you are doing, just provide the information out.',
                    [Video::fromUrl(url: $this->youtubeUrl)]
                )
                ->asText();

            $this->userForm->update(['status' => 'processing', 'text_content' => $response->text]);

            Log::info("Starting form generation for UserForm ID: {$this->userForm->id}");

            $formService->SetAccessToken($this->userForm['access_token']);

            Log::info('Generating form outline...');

            $structuredResponse = $formService->GenerateFormOutline($this->userForm['text_content'], $this->userForm['prompt_instructions']);

            Log::info('Verifying questions...');
            $structuredVerificationResponse = $formService->VerifyQuestions($this->userForm['text_content'], $structuredResponse);

            Log::info('Creating Google Form...');
            $formTitle = $this->userForm['title'] ?? $structuredResponse['title'];
            $formId = $formService->CreateForm($formTitle);

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
            $description = $formService->GenerateDescription($this->userForm['text_content'], $questionListText, $this->userForm['prompt_rewrite_instructions']);
            $formService->SetFormDescription($formId, $description);

            Log::info('Getting form URL...');
            $formUrl = $formService->formsService->forms->get($formId)->responderUri;

            $this->userForm->update([
                'form_url' => $formUrl,
                'status' => 'completed',
            ]);

            Log::info("Form generation completed successfully for UserForm ID: {$this->userForm->id}");

        } catch (Exception $ex) {
            Log::error("Form generation failed for UserForm ID: {$this->userForm->id} - Error: ".$ex->getMessage());

            $this->userForm->update(['status' => 'failed']);

            $this->fail($ex);
        }
    }
}

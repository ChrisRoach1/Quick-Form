<?php

namespace App\Jobs;

use App\Models\UserForm;
use App\Services\FormService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class GenerateForm implements ShouldQueue
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
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [30, 60, 120]; // Wait 30s, then 60s, then 120s between retries
    }

    /**
     * Create a new job instance.
     */
    public function __construct(public UserForm $userForm)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(FormService $formService): void
    {
        try{
            $this->userForm->update(['status' => 'processing']);

            Log::info("Starting form generation for UserForm ID: {$this->userForm->id}");

            $formService->SetAccessToken($this->userForm['access_token']);

            Log::info("Generating form outline...");
            $structuredResponse = $formService->GenerateFormOutline($this->userForm['text_content'], $this->userForm['prompt_instructions']);

            Log::info("Verifying questions...");
            $structuredVerificationResponse = $formService->VerifyQuestions($this->userForm['text_content'], $structuredResponse);

            Log::info("Creating Google Form...");
            $formId = $formService->CreateForm($structuredResponse['title']);

            $questionListText = 'RAW QUESTION LIST: ';

            Log::info("Adding fill-in-the-blank questions...");
            foreach ($structuredResponse['FillInTheBlankQuestions'] as $question)
            {
                $questionText = $question[0];
                $answer = $question[1];

                foreach ($structuredVerificationResponse['problemQuestions'] as $problemQuestion){
                    if($problemQuestion[0] === $questionText){
                        $answer = $problemQuestion[1];
                    }
                }

                $questionListText .= '; ' . $questionText;
                $formService->addTextQuestion($formId, $questionText, $answer, true);
            }

            Log::info("Adding multiple choice questions...");
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

                $questionListText .= '; ' . $questionText;
                $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer, true);

            }

            Log::info("Adding yes/no questions...");
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

                $questionListText .= '; ' . $questionText;
                $formService->addMultipleChoiceQuestion($formId, $questionText, $choices, $answer, true);
            }

            Log::info("Generating form description...");
            $description = $formService->GenerateDescription($this->userForm['text_content'], $questionListText, $this->userForm['prompt_rewrite_instructions']);;
            $formService->SetFormDescription($formId, $description);

            Log::info("Getting form URL...");
            $formUrl = $formService->formsService->forms->get($formId)->responderUri;

            $this->userForm->update([
                'form_url' => $formUrl,
                'status' => 'completed'
            ]);

            Log::info("Form generation completed successfully for UserForm ID: {$this->userForm->id}");

        } catch (\Exception $ex) {
            Log::error("Form generation failed for UserForm ID: {$this->userForm->id} - Error: " . $ex->getMessage());

            $this->userForm->update(['status' => 'failed']);

            $this->fail($ex);
        }
    }
}

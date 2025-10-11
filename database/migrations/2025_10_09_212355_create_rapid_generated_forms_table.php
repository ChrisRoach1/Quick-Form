<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rapid_generated_forms', function (Blueprint $table): void {
            $table->id();
            $table->uuid('external_id')->nullable(true);
            $table->longText('text_content');
            $table->longText('prompt_instructions')->nullable(true);
            $table->string('form_url')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_generated_forms');
    }
};

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
        Schema::create('user_forms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable(false)->index();
            $table->longText('text_content');
            $table->longText('prompt_instructions')->nullable(true);
            $table->longText('prompt_rewrite_instructions')->nullable(true);
            $table->string('status');
            $table->string('form_url')->nullable(true);
            $table->longText('access_token')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_forms');
    }
};

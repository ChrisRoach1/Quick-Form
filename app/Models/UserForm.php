<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class UserForm extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'text_content',
        'prompt_instructions',
        'prompt_rewrite_instructions',
        'status',
        'form_url',
        'access_token',
        'raw_output'
    ];

    protected $casts = [
        'access_token' => 'encrypted',
        'raw_output' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

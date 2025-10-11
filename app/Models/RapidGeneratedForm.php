<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class RapidGeneratedForm extends Model
{
    //

    protected $fillable = [
        'text_content',
        'prompt_instructions',
        'form_url',
        'external_id',
    ];
}

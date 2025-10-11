<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class PaidStripeSession extends Model
{
    protected $fillable = [
        'user_id',
        'paid',
        'stripe_session_id',
    ];
}

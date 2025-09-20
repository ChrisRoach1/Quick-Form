<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaidStripeSession extends Model
{
    protected $fillable = [
        'user_id',
        'paid',
        'stripe_session_id'
    ];

}

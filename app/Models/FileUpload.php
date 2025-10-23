<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class FileUpload extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'file_name',
        'file_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

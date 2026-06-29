<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorshipInquiry extends Model
{
    use HasFactory;

    protected $fillable = ['tier', 'price', 'status'];
}
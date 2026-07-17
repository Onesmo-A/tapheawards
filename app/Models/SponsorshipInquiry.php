<?php

namespace App\Models;

use App\Traits\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorshipInquiry extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['tier', 'price', 'status', 'company_name', 'contact_name', 'email', 'phone', 'message'];
}
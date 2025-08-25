<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NomineeApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Hii inahakikisha tunatuma data safi na muhimu tu kwenda frontend.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'applicant_name' => $this->applicant_name,
            'applicant_phone' => $this->applicant_phone,
            'applicant_email' => $this->applicant_email,
            'bio' => $this->bio,
            'photo_url' => $this->photo_url,
            'status' => $this->status,
            'nomination_fee' => $this->nomination_fee,
            'created_at' => $this->created_at->format('Y-m-d'),
            'category_name' => $this->category?->name, // Ongeza hii
            'transaction' => $this->whenLoaded('transaction'),
        ];
    }
}

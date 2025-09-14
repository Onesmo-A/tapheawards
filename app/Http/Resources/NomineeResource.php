<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class NomineeResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, // Muhimu kwa ajili ya endpoint ya kupiga kura
            'name' => $this->name,
            'bio' => $this->bio,
            'image_url' => $this->image_url, // Tumia accessor kutoka kwa Model
            // Muhimu kwa ajili ya UX ya kuzuia kura rudia kwenye kategoria
            'category_id' => $this->category_id,
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'tiktok_url' => $this->tiktok_url,
        ];
    }
}
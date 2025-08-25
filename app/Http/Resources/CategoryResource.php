<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'nominees' => NomineeResource::collection($this->whenLoaded('nominees')),
            'nominees_count' => $this->when(isset($this->nominees_count), $this->nominees_count),

             // Hii ni muhimu: inajumuisha 'children' kama zilipakiwa na controller
            'children' => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}

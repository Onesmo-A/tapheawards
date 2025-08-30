<?php

namespace App\Http\Resources;

use App\Http\Resources\NomineeResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;



class CategoryResource extends JsonResource
{
    /**
     * Hii inazuia Laravel kufunga data ndani ya "data" key,
     * na kurahisisha matumizi kwenye Vue.
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
            'parent_id' => $this->parent_id,
            'image_url' => $this->image_url,
            'status' => $this->status,
            'nominees_count' => $this->whenCounted('nominees'),
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            // Hii ndiyo njia sahihi ya kujumuisha data za washiriki
            'nominees' => NomineeResource::collection($this->whenLoaded('nominees')),
        ];
    }

}

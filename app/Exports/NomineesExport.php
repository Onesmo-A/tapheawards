<?php

namespace App\Exports;

use App\Models\Nominee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NomineesExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Tunapata washiriki wote na kategoria zao pamoja na idadi ya kura
        return Nominee::with('category')->withCount('votes')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // Hivi ni vichwa vya habari vya safu (columns) kwenye Excel
        return [
            'ID',
            'Name',
            'Category',
            'Votes',
            'Bio',
            'Created At',
        ];
    }

    /**
     * @param Nominee $nominee
     * @return array
     */
    public function map($nominee): array
    {
        // Hapa tunapanga data kwa kila mshiriki jinsi itakavyoonekana
        return [
            $nominee->id,
            $nominee->name,
            $nominee->category->name ?? 'N/A', // Kama hana kategoria, itaonyesha N/A
            $nominee->votes_count,
            $nominee->bio,
            $nominee->created_at->toDateTimeString(),
        ];
    }
}


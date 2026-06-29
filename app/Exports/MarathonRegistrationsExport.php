<?php

namespace App\Exports;

use App\Models\MarathonRegistration;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MarathonRegistrationsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        return MarathonRegistration::query()
            ->when($this->request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%")
                        ->orWhere('unique_code', 'like', "%{$search}%");
                });
            })
            ->when($this->request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'Unique Code',
            'Full Name',
            'Phone Number',
            'Email',
            'Race Type',
            'T-Shirt Size',
            'Status',
            'Registered At',
        ];
    }

    public function map($registration): array
    {
        return [
            $registration->unique_code,
            $registration->full_name,
            $registration->phone_number,
            $registration->email,
            $registration->race_type,
            $registration->tshirt_size,
            ucwords(str_replace('_', ' ', $registration->status)),
            $registration->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
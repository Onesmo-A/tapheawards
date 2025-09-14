<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; }
        h1 { text-align: center; margin-bottom: 5px; }
        p { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; font-size: 9px; }
        th { background-color: #f0f0f0; font-weight: bold; }
        .status { text-transform: capitalize; }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p><strong>Tarehe ya Ripoti:</strong> {{ $date }}</p>

    @if($filters['search'] ?? false)
        <p><strong>Kichujio (Search):</strong> "{{ $filters['search'] }}"</p>
    @endif
    @if($filters['status'] ?? false)
        <p><strong>Kichujio (Status):</strong> "{{ str_replace('_', ' ', $filters['status']) }}"</p>
    @endif

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Applicant Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Submitted On</th>
                <th>Reviewed By</th>
                <th>Reviewed At</th>
            </tr>
        </thead>
        <tbody>
            @forelse($applications as $application)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $application->applicant_name }}</td>
                <td>{{ $application->category->name ?? 'N/A' }}</td>
                <td class="status">{{ str_replace('_', ' ', $application->status) }}</td>
                <td class="status">{{ $application->transaction->status ?? 'N/A' }}</td>
                <td>{{ $application->created_at->format('d M, Y H:i') }}</td>
                <td>{{ $application->reviewer->name ?? 'N/A' }}</td>
                <td>{{ $application->reviewed_at ? \Carbon\Carbon::parse($application->reviewed_at)->format('d M, Y H:i') : 'N/A' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center;">Hakuna maombi yaliyopatikana kwa vigezo hivi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

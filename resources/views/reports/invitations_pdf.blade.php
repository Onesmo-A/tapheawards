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
        th, td { border: 1px solid #333; padding: 6px; text-align: left; font-size: 9px; word-wrap: break-word; }
        th { background-color: #f0f0f0; font-weight: bold; }
        .status { text-transform: capitalize; }
        .footer {
            position: fixed;
            bottom: -20px;
            left: 0px;
            right: 0px;
            height: 30px;
            text-align: center;
            line-height: 35px;
            font-size: 9px;
            color: #888;
        }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p><strong>Tarehe ya Ripoti:</strong> {{ $date }}</p>

    @if($filters['search'] ?? false)
        <p><strong>Kichujio (Search):</strong> "{{ $filters['search'] }}"</p>
    @endif
    @if($filters['rsvp_status'] ?? false)
        <p><strong>Kichujio (RSVP Status):</strong> "{{ $filters['rsvp_status'] }}"</p>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 4%;">#</th>
                <th style="width: 25%;">Guest Name</th>
                <th style="width: 20%;">Title</th>
                <th style="width: 12%;">Card Status</th>
                <th style="width: 12%;">RSVP Status</th>
                <th style="width: 15%;">Created At</th>
            </tr>
        </thead>
        <tbody>
            @forelse($invitations as $invitation)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $invitation->guest_name }}</td>
                <td>{{ $invitation->guest_title ?? 'N/A' }}</td>
                <td class="status">{{ $invitation->status }}</td>
                <td class="status">{{ $invitation->rsvp_status }}</td>
                <td>{{ $invitation->created_at->format('d M, Y H:i') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">Hakuna mialiko iliyopatikana kwa vigezo hivi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        TAPHE Awards &copy; {{ date('Y') }} - Ukurasa <script type="text/php">
            if (isset($pdf)) { $font = $fontMetrics->getFont("DejaVu Sans"); $pdf->page_text(500, 750, "{PAGE_NUM} / {PAGE_COUNT}", $font, 9); }
        </script>
    </div>
</body>
</html>
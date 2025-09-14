<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: left; }
        th { background-color: #f0f0f0; }
        h1, h2 { text-align: center; margin: 0; }
        .page-number { text-align: right; font-size: 9px; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>Date: {{ $date }}</p>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>User</th>
                <th>For</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transactions as $index => $tx)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $tx->order_id }}</td>
                <td>{{ $tx->user->name ?? '-' }}</td>
                <td>{{ $tx->payable->applicant_name ?? '-' }}</td>
                <td>{{ $tx->amount }} {{ $tx->currency }}</td>
                <td>{{ ucfirst($tx->status) }}</td>
                <td>{{ $tx->phone_number }}</td>
                <td>{{ $tx->created_at->format('d M, Y H:i') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="page-number">
        Page {PAGE_NUM} of {PAGE_COUNT}
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TAPHE Awards - Ticket Purchases Registry</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            font-size: 11px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 2px solid #D90429;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo-section {
            float: left;
        }
        .title-section {
            float: right;
            text-align: right;
        }
        .logo-section h1 {
            color: #D90429;
            font-size: 22px;
            margin: 0;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 1px;
        }
        .logo-section p {
            margin: 2px 0 0 0;
            font-size: 10px;
            color: #777;
            text-transform: uppercase;
        }
        .title-section h2 {
            font-size: 16px;
            margin: 0;
            color: #111;
            text-transform: uppercase;
        }
        .title-section p {
            margin: 2px 0 0 0;
            color: #666;
        }
        .clear {
            clear: both;
        }
        .stats-grid {
            margin-bottom: 25px;
            background: #fdfdfd;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 12px;
        }
        .stats-col {
            float: left;
            width: 33.33%;
            text-align: center;
        }
        .stats-col span {
            display: block;
            font-size: 9px;
            text-transform: uppercase;
            color: #888;
            font-weight: bold;
        }
        .stats-col strong {
            display: block;
            font-size: 16px;
            color: #D90429;
            margin-top: 4px;
        }
        .table-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            color: #222;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background-color: #f5f5f5;
            color: #444;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
            text-transform: uppercase;
            font-size: 9px;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #eee;
            color: #555;
        }
        tr:nth-child(even) td {
            background-color: #fafafa;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-completed {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1px solid #eee;
            padding-top: 8px;
            text-align: center;
            font-size: 8px;
            color: #999;
        }
        .security-hash {
            font-family: monospace;
            font-size: 8px;
            color: #bbb;
            margin-top: 4px;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo-section">
            <h1>TAPHE Awards</h1>
            <p>Tanzania Private Healthcare Excellence Awards</p>
        </div>
        <div class="title-section">
            <h2>Ticket Purchases</h2>
            <p>Generated: {{ now()->format('d M, Y H:i') }}</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="stats-grid">
        <div class="stats-col">
            <span>Total Sales Revenue</span>
            <strong>{{ number_format($totalRevenue) }} TZS</strong>
        </div>
        <div class="stats-col">
            <span>Tickets Issued</span>
            <strong>{{ $totalTickets }} Tickets</strong>
        </div>
        <div class="stats-col">
            <span>Checked-In Guests</span>
            <strong>{{ $totalCheckedIn }} Guests</strong>
        </div>
        <div class="clear"></div>
    </div>

    <div class="table-title">Registry Purchases List</div>
    <table>
        <thead>
            <tr>
                <th style="width: 15%;">Date</th>
                <th style="width: 25%;">Purchaser</th>
                <th style="width: 25%;">Ticket Type</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 15%;">Amount</th>
                <th style="width: 10%; text-align: right;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($purchases as $p)
                <tr>
                    <td>{{ $p->created_at->format('d/m/Y') }}</td>
                    <td>
                        <strong>{{ $p->purchaser_name }}</strong><br>
                        <span style="font-size: 8px; color: #888;">{{ $p->purchaser_phone }}</span>
                    </td>
                    <td>{{ $p->ticketType->name ?? 'N/A' }}</td>
                    <td style="text-align: center;">{{ $p->quantity }}</td>
                    <td>{{ number_format($p->total_amount) }} TZS</td>
                    <td style="text-align: right;">
                        <span class="badge {{ $p->status === 'completed' ? 'badge-completed' : 'badge-pending' }}">
                            {{ $p->status }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <div>TAPHE Awards Official Administrative Registry Export &copy; {{ date('Y') }}</div>
        <div class="security-hash">Document Checksum Hash: {{ hash('sha256', json_encode($purchases->pluck('id'))) }}</div>
    </div>

</body>
</html>

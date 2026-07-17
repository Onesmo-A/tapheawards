<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TAPHE Awards - Live Vote Standings Report</title>
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
            width: 50%;
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
        .category-block {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .category-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #f5f5f5;
            padding: 6px 10px;
            border-left: 3px solid #D90429;
            color: #111;
            margin-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th {
            color: #666;
            font-weight: bold;
            text-align: left;
            padding: 6px 8px;
            border-bottom: 1px solid #ddd;
            text-transform: uppercase;
            font-size: 8px;
        }
        td {
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
            color: #555;
        }
        tr:nth-child(even) td {
            background-color: #fafafa;
        }
        .rank-badge {
            font-weight: bold;
            color: #D90429;
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
            <h2>Live Vote Standings</h2>
            <p>Generated: {{ now()->format('d M, Y H:i') }}</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="stats-grid">
        <div class="stats-col">
            <span>Total Categories</span>
            <strong>{{ count($standings) }} Categories</strong>
        </div>
        <div class="stats-col">
            <span>Total Votes Counted</span>
            <strong>{{ number_format($totalVotes) }} Votes</strong>
        </div>
        <div class="clear"></div>
    </div>

    @foreach($standings as $categoryName => $nominees)
        <div class="category-block">
            <div class="category-title">{{ $categoryName }}</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 10%;">Rank</th>
                        <th style="width: 50%;">Nominee</th>
                        <th style="width: 20%; text-align: center;">Votes Count</th>
                        <th style="width: 20%; text-align: right;">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    @php 
                        $totalCatVotes = collect($nominees)->sum('votes_count');
                    @endphp
                    @foreach($nominees as $index => $n)
                        @php
                            $pct = $totalCatVotes > 0 ? round(($n['votes_count'] / $totalCatVotes) * 100, 1) : 0;
                        @endphp
                        <tr>
                            <td class="rank-badge">#{{ $index + 1 }}</td>
                            <td><strong>{{ $n['name'] }}</strong></td>
                            <td style="text-align: center;">{{ number_format($n['votes_count']) }}</td>
                            <td style="text-align: right;">{{ $pct }}%</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach

    <div class="footer">
        <div>TAPHE Awards Official Administrative Standings Export &copy; {{ date('Y') }}</div>
        <div class="security-hash">Document Checksum Hash: {{ hash('sha256', json_encode($standings)) }}</div>
    </div>

</body>
</html>

<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #1f2937;
            background: #ffffff;
        }
        @page {
            margin: 112px 28px 42px 28px;
        }
        header {
            position: fixed;
            top: -90px;
            left: 0px;
            right: 0px;
            height: 76px;
            background-color: #ffffff;
            border-bottom: 2px solid #d1d5db;
            padding: 12px 24px;
        }
        .header-title h1 {
            margin: 0;
            font-size: 22px;
            color: #111827;
            font-weight: bold;
        }
        .header-title p {
            margin: 5px 0 0 0;
            font-size: 14px;
            color: #6b7280;
        }
        .header-info {
            position: absolute;
            top: 10px;
            right: 25px;
            text-align: right;
        }
        .header-info p {
            margin: 0;
            font-size: 12px;
            color: #6b7280;
        }
        footer {
            position: fixed;
            bottom: -18px;
            left: 0px;
            right: 0px;
            height: 30px;
            text-align: center;
            line-height: 35px;
            font-size: 10px;
            color: #6b7280;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
            text-align: left;
            vertical-align: middle;
        }
        thead tr {
            background-color: #111827;
            color: #ffffff;
            text-transform: uppercase;
            font-size: 10px;
        }
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .rank {
            font-weight: bold;
            font-size: 14px;
            text-align: center;
        }
        .votes {
            font-weight: bold;
            text-align: right;
        }
        .total-row td {
            font-weight: bold;
            background-color: #f3f4f6;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-title">
            <h1>{{ $category->name }}</h1>
            <p>Ripoti ya Matokeo ya Kura</p>
        </div>
        <div class="header-info">
            <p><strong>Business Awards</strong></p>
            <p>Tarehe: {{ $date }}</p>
        </div>
    </header>

    <footer>
        Business Awards &copy; {{ date('Y') }} - Ukurasa <script type="text/php">
            if (isset($pdf)) { $font = $fontMetrics->getFont("DejaVu Sans"); $pdf->page_text(500, 800, "Ukurasa {PAGE_NUM} / {PAGE_COUNT}", $font, 10); }
        </script>
    </footer>

    <main>
        <table>
            <thead>
                <tr>
                    <th style="width: 10%; text-align: center;">Mpangilio</th>
                    <th>Mshiriki (Nominee)</th>
                    <th style="width: 20%; text-align: right;">Jumla ya Kura</th>
                    <th style="width: 20%; text-align: right;">Asilimia (%)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($nominees as $nominee)
                    <tr>
                        <td class="rank">{{ $loop->iteration }}</td>
                        <td>{{ $nominee->name ?? 'N/A' }}</td>
                        <td class="votes">{{ number_format($nominee->votes_count) }}</td>
                        <td class="votes">
                            @if($totalVotes > 0)
                                {{ number_format(($nominee->votes_count / $totalVotes) * 100, 2) }}%
                            @else
                                0.00%
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center;">Hakuna washiriki katika kategoria hii.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="2" style="text-align: right;">Jumla Kuu ya Kura</td>
                    <td class="votes">{{ number_format($totalVotes) }}</td>
                    <td class="votes">100.00%</td>
                </tr>
            </tfoot>
        </table>
    </main>
</body>
</html>

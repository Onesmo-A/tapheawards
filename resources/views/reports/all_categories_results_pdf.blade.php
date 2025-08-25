<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
        }
        @page {
            margin: 120px 30px 40px 30px;
        }
        header {
            position: fixed;
            top: -90px;
            left: 0px;
            right: 0px;
            height: 70px;
            background-color: #f8f9fa;
            border-bottom: 3px solid #D4AF37; /* Gold color */
            padding: 10px 25px;
        }
        .header-title h1 {
            margin: 0;
            font-size: 24px;
            color: #111827;
            font-weight: bold;
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
            color: #4B5563;
        }
        footer {
            position: fixed;
            bottom: -20px;
            left: 0px;
            right: 0px;
            height: 30px;
            text-align: center;
            line-height: 35px;
            font-size: 10px;
            color: #888;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 25px; /* Space between tables */
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 6px 8px;
            text-align: left;
            vertical-align: middle;
        }
        thead tr {
            background-color: #1F2937;
            color: #D4AF37;
            text-transform: uppercase;
            font-size: 10px;
        }
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .rank {
            font-weight: bold;
            font-size: 12px;
            text-align: center;
        }
        .votes {
            font-weight: bold;
            text-align: right;
        }
        .total-row td {
            font-weight: bold;
            background-color: #e2e8f0;
        }
        .category-header {
            background-color: #374151;
            color: white;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            border-radius: 5px;
        }
        .page-break {
            page-break-after: always;
        }
        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-title">
            <h1>{{ $title }}</h1>
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
        @forelse($categories as $category)
            <div class="no-break">
                <div class="category-header">
                    {{ $category->name }}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%; text-align: center;">Nafasi</th>
                            <th>Mshiriki (Nominee)</th>
                            <th style="width: 20%; text-align: right;">Jumla ya Kura</th>
                            <th style="width: 20%; text-align: right;">Asilimia (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($category->nominees as $nominee)
                            <tr>
                                <td class="rank">{{ $loop->iteration }}</td>
                                <td>{{ $nominee->name ?? 'N/A' }}</td>
                                <td class="votes">{{ number_format($nominee->votes_count) }}</td>
                                <td class="votes">
                                    @if($category->totalVotes > 0)
                                        {{ number_format(($nominee->votes_count / $category->totalVotes) * 100, 2) }}%
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
                            <td class="votes">{{ number_format($category->totalVotes) }}</td>
                            <td class="votes">100.00%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            @if(!$loop->last)
                <div class="page-break"></div>
            @endif
        @empty
            <p>Hakuna kategoria zenye washiriki zilizopatikana.</p>
        @endforelse
    </main>
</body>
</html>
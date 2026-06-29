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
            color: #1f2937;
            background: #ffffff;
        }
        @page {
            margin: 110px 28px 42px 28px;
        }
        header {
            position: fixed;
            top: -90px;
            left: 0px;
            right: 0px;
            height: 72px;
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
        .report-section {
            margin-bottom: 10px;
        }

        .category-header {
            margin: 0 0 10px 0;
            padding: 10px 12px;
            background: transparent;
            border-left: 4px solid #6b7280;
            color: #111827;
            font-size: 15px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 7px 8px;
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
            background-color: #ffffff;
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
            background-color: #f3f4f6;
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
        @forelse($mainGroups as $mainGroup)
            <section class="report-section no-break">
                <div class="category-header">{{ $mainGroup->name }}</div>

                @php
                    $exportCategories = $mainGroup->export_categories ?? collect();
                @endphp

                @if($exportCategories->isEmpty())
                    {{-- Kama Main Group haina category (children) kwenye export --}}
                    <p style="margin: 0 0 10px 0;">{{ $mainGroup->name }}</p>
                    <p style="margin: 0 0 10px 0;">No nominee</p>
                    <p style="margin: 0 0 10px 0;">No category</p>
                @else
                    @foreach($exportCategories as $category)
                        <div style="margin-top: 8px;">
                            <div class="category-header" style="border-left-color:#6b7280;">{{ $category->name }}</div>

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
                                    @forelse($category->nominees as $nominee)
                                        <tr>
                                            <td class="rank">{{ $loop->iteration }}</td>
                                            <td>{{ $nominee->name ?? 'N/A' }}</td>
                                            <td class="votes">{{ number_format($nominee->votes_count) }}</td>
                                            <td class="votes">
                                                @if(($category->totalVotes ?? 0) > 0)
                                                    {{ number_format(($nominee->votes_count / $category->totalVotes) * 100, 2) }}%
                                                @else
                                                    0.00%
                                                @endif
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="4" style="text-align: center;">No nominee</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                                <tfoot>
                                    <tr class="total-row">
                                        <td colspan="2" style="text-align: right;">Jumla Kuu ya Kura</td>
                                        <td class="votes">{{ number_format($category->totalVotes ?? 0) }}</td>
                                        <td class="votes">100.00%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    @endforeach
                @endif
            </section>
        @empty
            <p>Hakuna kategoria zenye washiriki zilizopatikana.</p>
        @endforelse
    </main>
</body>
</html>

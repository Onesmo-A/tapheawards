<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
        }
        @page {
            margin: 100px 25px 40px 25px;
        }
        header {
            position: fixed;
            top: -80px;
            left: 0px;
            right: 0px;
            height: 70px;
            background-color: #f8f9fa;
            border-bottom: 3px solid #D4AF37; /* Gold color */
            padding: 10px 25px;
            line-height: 35px;
        }
        .header-title {
            float: left;
        }
        .header-title h1 {
            margin: 0;
            font-size: 24px;
            color: #111827; /* Dark Gray */
            font-weight: bold;
        }
        .header-info {
            float: right;
            text-align: right;
        }
        .header-info p {
            margin: 0;
            font-size: 12px;
            color: #4B5563; /* Gray */
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
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 8px;
            text-align: left;
        }
        thead tr {
            background-color: #1F2937; /* Dark Blue/Gray */
            color: #D4AF37; /* Gold */
            text-transform: uppercase;
            font-size: 10px;
        }
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
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
            <p>Tarehe ya Ripoti: {{ $date }}</p>
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
                    <th>#</th>
                    <th>Mshiriki (Nominee)</th>
                    <th>Kategoria</th>
                    <th>Anwani ya IP</th>
                    <th>Muda wa Kura</th>
                </tr>
            </thead>
            <tbody>
                @forelse($votes as $vote)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $vote->nominee->name ?? 'N/A' }}</td>
                        <td>{{ $vote->nominee->category->name ?? 'N/A' }}</td>
                        <td>{{ $vote->ip_address }}</td>
                        <td>{{ $vote->created_at->setTimezone('Africa/Nairobi')->format('d M, Y H:i') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center;">Hakuna kura zilizopatikana.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </main>
</body>
</html>
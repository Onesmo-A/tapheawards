<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 10px; 
            margin: 40px 30px 40px 30px; 
        }
        h1 { text-align: center; margin-bottom: 5px; }
        p { margin: 3px 0; }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
            page-break-inside: auto; 
            table-layout: fixed; /* hii inasaidia columns zisivuke sana */
        }
        th, td { 
            border: 1px solid #333; 
            padding: 4px; 
            text-align: left; 
            font-size: 9px; 
            word-wrap: break-word; /* maelezo yapinde badala ya kupanua column */
        }
        th { background: #f0f0f0; }

        /* Font ndogo kwa Reason column */
        td.reason-col {
            font-size: 8px; 
            line-height: 1.2; 
        }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>Date: {{ $date }}</p>

    @if($filters['search'] ?? false)
        <p>Search filter: {{ $filters['search'] }}</p>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 3%;">#</th>
                <th style="width: 18%;">Suggested Nominee</th>
                <th style="width: 10%;">Phone</th>
                <th style="width: 30%;">Reason</th> <!-- nimeipa nafasi zaidi -->
                <th style="width: 12%;">Suggester</th>
                <th style="width: 12%;">Category</th>
                <th style="width: 15%;">Submitted At</th>
            </tr>
        </thead>
        <tbody>
            @foreach($suggestions as $suggestion)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $suggestion->suggested_nominee_name }}</td>
                    <td>{{ $suggestion->suggested_nominee_phone ?? 'N/A' }}</td>
                    <td class="reason-col">{{ $suggestion->reason }}</td> <!-- tumetumia class -->
                    <td>{{ $suggestion->suggester_name ?? 'N/A' }}</td>
                    <td>{{ $suggestion->category->name ?? 'N/A' }}</td>
                    <td>{{ $suggestion->created_at->format('d M, Y H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif; /* Muhimu kwa herufi za Kiswahili */
            font-size: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0;
            font-size: 11px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
            font-size: 9px;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .status {
            text-transform: capitalize;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Ripoti Imetolewa: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Code</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Race</th>
                <th>T-Shirt</th>
                <th>Region</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($registrations as $registration)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $registration->unique_code }}</td>
                    <td>{{ $registration->full_name }}</td>
                    <td>{{ $registration->phone_number }}</td>
                    <td>{{ $registration->email ?? 'N/A' }}</td>
                    <td>{{ $registration->race_type }}</td>
                    <td>{{ $registration->tshirt_size }}</td>
                    <td>{{ $registration->region }}</td>
                    <td class="status">{{ str_replace('_', ' ', $registration->status) }}</td>
                </tr>
            @empty
            <tr>
                <td colspan="9" style="text-align: center;">Hakuna wasajiliwa waliopatikana kwa vigezo hivi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
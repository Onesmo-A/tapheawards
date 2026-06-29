<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>TAPHE Awards Ticket</title>
<style>
    @page { margin: 0; size: A4 landscape; }
    body {
        font-family: DejaVu Sans, sans-serif;
        margin: 0;
        padding: 15px;
        background: #f5f5f5;
        font-size: 12px;
    }
    .page-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .ticket {
        width: 400px;
        height: 160px;
        margin: 8px;
        border-radius: 10px;
        background: #fff;
        border: 2px solid #c5a553;
        display: flex;
        overflow: hidden;
    }
    .ticket-main {
        flex: 2;
        padding: 10px;
        position: relative;
    }
    .ticket-stub {
        flex: 1;
        background: #4a0303;
        color: #fff;
        border-left: 2px dashed #c5a553;
        padding: 10px;
        text-align: center;
    }
    .logo { width: 50px; margin-bottom: 5px; }
    .event-title { font-size: 14px; font-weight: bold; color: #4a0303; }
    .event-subtitle { font-size: 10px; margin-bottom: 5px; }
    .details p { margin: 2px 0; font-size: 9px; }
    .price-tag { font-size: 11px; font-weight: bold; color: #4a0303; }
    .qr-code img { width: 70px; height: 70px; margin-bottom: 5px; }
    .ticket-code { font-size: 8px; font-family: monospace; color: #fde047; word-break: break-word; }
</style>
</head>
<body>
@php
    $logoPath = public_path('images/logo.png');
    $logoType = pathinfo($logoPath, PATHINFO_EXTENSION);
    $logoData = file_get_contents($logoPath);
    $logoBase64 = 'data:image/' . $logoType . ';base64,' . base64_encode($logoData);
@endphp

<div class="page-container">
    @foreach ($purchase->tickets as $index => $ticket)
    <div class="ticket">
        <div class="ticket-main">
            <img src="{{ $logoBase64 }}" alt="Logo" class="logo">
            <div class="event-title">TAPHE AWARDS 2025</div>
            <div class="event-subtitle">GALA NIGHT</div>
            <div class="details">
                <p><strong>Attendee:</strong> {{ $purchase->purchaser_name }}</p>
                <p><strong>Type:</strong> {{ $purchase->ticketType->name }}</p>
                <p><strong>Order:</strong> {{ $purchase->mainTransaction->order_id }}</p>
            </div>
            <div class="price-tag">TZS {{ number_format($purchase->ticketType->price, 0) }}/=</div>
        </div>
        <div class="ticket-stub">
            <div class="qr-code">
                <img src="data:image/png;base64,{{ $qrCodes[$ticket->id] }}" alt="QR Code">
            </div>
            <p class="ticket-code">{{ $ticket->ticket_code }}</p>
            <p>Ticket {{ $index + 1 }} of {{ $purchase->quantity }}</p>
        </div>
    </div>
    @endforeach
</div>
</body>
</html>

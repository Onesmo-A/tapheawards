<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>TAPHE Awards Ticket</title>
<style>
    @page { margin: 0; }
    body {
        font-family: 'Helvetica Neue', 'Arial', sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #fdf2f2; /* soft light red background */
        font-size: 12px;
    }
    .ticket {
        display: table;
        width: 700px;
        height: 260px;
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        background: linear-gradient(145deg, #ffffff 0%, #ffeaea 100%);
        border: 1px solid #4a0303ff;
        page-break-inside: avoid;
        margin-bottom: 25px; /* Ongeza nafasi kati ya tiketi */
    }
    .ticket-main, .ticket-stub {
        display: table-cell;
        vertical-align: top;
        box-sizing: border-box;
        padding: 25px;
        position: relative;
    }
    .ticket-main {
        width: 480px;
        background: linear-gradient(145deg, #ffffff 0%, #ffe5e5 100%);
    }
    .ticket-stub {
        width: 220px;
        background-color: #B91C1C; /* deep red stub */
        color: #fff;
        border-left: 1px dashed #FCA5A5;
    }
    .dashed-line {
        position: absolute;
        left: -1px;
        top: 10px;
        bottom: 10px;
        width: 2px;
        border-left: 3px dashed #ffffffff;
    }
    .logo { width: 95px; margin-bottom: 12px; }
    .stub-logo { width: 75px; opacity: 0.8; margin-bottom: 12px; }
    .event-title {
        font-size: 20px;
        font-weight: 700;
        color: #B91C1C; /* deep red */
        letter-spacing: 1px;
        margin-bottom: 18px;
    }
    .details p, .stub-details p {
        margin: 4px 0;
        line-height: 1.5;
        font-size: 11px;
    }
    .details strong, .stub-details strong {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        color: #7F1D1D;
        letter-spacing: 0.5px;
    }
    .stub-details strong { color: #FDE2E2; }
    .qr-code { position: absolute; right: 20px; top: 55px; }
    .qr-code img { width: 120px; height: 120px; border: 2px solid #fff; border-radius: 4px; }
    .ticket-code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 13px;
        font-weight: bold;
        letter-spacing: 1.2px;
        color: #f8c211ff; /* gold accent */
    }
    .footer-text {
        font-size: 10px;
        color: #5c5757ff;
        margin-top: 15px;
        line-height: 1.3;
    }
    .price-tag {
        position: absolute;
        bottom: 20px;
        right: 25px;
        font-size: 16px;
        font-weight: bold;
        color: #040101ff;
    }
</style>
</head>
<body>
@php
    $logoPath = public_path('images/logo.png');
    $logoType = pathinfo($logoPath, PATHINFO_EXTENSION);
    $logoData = file_get_contents($logoPath);
    $logoBase64 = 'data:image/' . $logoType . ';base64,' . base64_encode($logoData);
@endphp

@foreach ($purchase->tickets as $index => $ticket)
<div class="ticket">
    <div class="ticket-main">
        <img src="{{ $logoBase64 }}" alt="Logo" class="logo">
        <div class="event-title">TAPHE AWARDS GALA NIGHT</div>
        <div class="details">
            <p><strong>{{ $purchase->ticketType->name }}</strong></p>
            <p><strong>{{ $purchase->purchaser_name }}</strong></p>
            <p><strong>{{ $purchase->purchaser_email }}</strong></p>
        </div>
        <div class="qr-code">
            <img src="data:image/png;base64,{{ $qrCodes[$ticket->id] }}" alt="QR Code">
        </div>
        <div class="footer-text">
            This ticket grants entry for one person. Not for resale.
        </div>
        <div class="price-tag">
            TZS {{ number_format($purchase->ticketType->price, 0) }}/=
        </div>
    </div>
    <div class="ticket-stub">
        <div class="dashed-line"></div>
        <img src="{{ $logoBase64 }}" alt="Logo" class="stub-logo">
        <div class="stub-details">
            <p><strong>Ticket Type</strong> {{ $purchase->ticketType->name }}</p>
            <p><strong>Attendee</strong> {{ $purchase->purchaser_name }}</p>
            <p><strong>Ticket ID</strong> <span class="ticket-code">{{ $ticket->ticket_code }}</span></p>
            <p><strong>Order ID</strong> {{ substr($purchase->mainTransaction->order_id, 0, 8) }}...</p>
            <p><strong>Ticket {{ $index + 1 }} of {{ $purchase->quantity }}</strong></p>
        </div>
    </div>
</div>
@endforeach
</body>
</html>

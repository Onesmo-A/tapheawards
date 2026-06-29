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
        padding: 15px; /* BORESHO: Ongeza padding ili ticket isiguse ukingo */
        background-color: #f4f4f4;
        font-size: 12px;
    }
    .ticket {
        display: table;
        width: 670px; /* BORESHO: Punguza upana zaidi ili kutoshea na body padding */
        height: 280px; /* BORESHO: Punguza urefu wa tiketi */
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        background-color: #fff;
        border: 1px solid #4a0303ff;
        page-break-inside: avoid;
        
    }
    .ticket-main, .ticket-stub {
        display: table-cell;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
    }
    .ticket-main {
        width: 230px; /* Punguza kidogo upana wa sehemu ya QR code */
        text-align: center; /* Weka maudhui katikati */
        padding: 20px;
        border-left: 2px dashed #a81d04ff; /* Mstari wa dashi wa dhahabu */
    }
    .ticket-stub {
        width: 440px; /* BORESHO: Punguza upana wa sehemu ya maelezo */
        background-color: #4a0303; /* Rangi nyekundu nyeusi */
        color: #ffffff;
        padding: 25px 30px; /* Ongeza padding */
    }
    .header {
        display: table;
        width: 100%;
        margin-bottom: 15px;
    }
    .logo-container {
        display: table-cell;
        width: 80px;
        vertical-align: top;
    }
    .stub-logo { width: 70px; opacity: 0.9; }
    .title-container {
        display: table-cell;
        vertical-align: middle;
        padding-left: 15px;
    }
    .event-title {
        font-size: 24px; /* Ongeza ukubwa wa kichwa cha habari */
        font-weight: 700;
        color: #c5a553; /* Rangi ya dhahabu */
        letter-spacing: 1px;
        margin: 0;
        line-height: 1.1;
    }
    .event-subtitle {
        font-size: 18px;
        font-weight: 300;
        color: #ffffff;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 5px 0 0 0;
    }
    .event-meta {
        /* BORESHO: Sasa ni sehemu ya .meta-container */
        display: table-cell;
        width: 55%;
        vertical-align: top;
        padding-right: 15px;
    }
    .event-meta p { margin: 0 0 8px 0; font-size: 12px; }
    .meta-container { /* BORESHO: Kontena mpya ya kupanga meta na sponsors */
        display: table;
        width: 100%;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    .stub-details {
        display: table;
        width: 100%;
        margin-top: 15px;
    }
    .stub-details .col {
        display: table-cell;
        width: 50%;
        vertical-align: top;
        padding-right: 10px;
    }
    .stub-details p {
        margin: 0 0 12px 0;
        line-height: 1.5;
        font-size: 12px;
    }
    .stub-details strong {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #c5a553;
        margin-bottom: 3px;
    }
    .qr-code {
        margin-top: 0.5px; /* BORESHO: Punguza nafasi juu ya QR code */
        text-align: center;
    }
    .qr-code img {
        width: 160px; /* Punguza ukubwa wa QR code */
        height: 160px;
        border: 5px solid #4a0303;
        border-radius: 8px;
        padding: 2px; /* Punguza padding kidogo */
        background: #fff;
    }
    .ticket-code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        word-break: break-all;
    }
    .footer-text {
        font-size: 10px;
        color: #4a0303;
        margin-top: 15px;
        line-height: 1.3;
    }
    .main-sponsor {
        margin-top: 10px; /* BORESHO: Punguza nafasi juu ya nembo ya mfadhili */
        text-align: center;
    }
    .main-sponsor strong {
        display: block;
        margin-bottom: 5px;
        font-size: 10px;
        text-transform: uppercase;
        color: #777;
        letter-spacing: 1px;
    }
    .main-sponsor img {
        max-height: 40px;
        max-width: 120px;
    }
    .sponsors-footer {
        /* BORESHO: Sasa ni sehemu ya .meta-container */
        display: table-cell;
        width: 45%;
        vertical-align: top;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.8);
    }
    .sponsors-logos {
        display: table;
        margin-top: 4px;
    }
    .sponsor-logo {
        display: table-cell;
        padding-right: 12px;
        vertical-align: middle;
        height: 25px;
    }
</style>
</head>
<body>
@php
    $logoPath = public_path('images/logo.png');
    $logoType = pathinfo($logoPath, PATHINFO_EXTENSION);
    $logoData = file_get_contents($logoPath);
    $logoBase64 = 'data:image/' . $logoType . ';base64,' . base64_encode($logoData);

    // BORESHO: Ongeza SVG ya ikoni ya eneo na tarehe
    $locationIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
    $locationIconBase64 = 'data:image/svg+xml;base64,' . base64_encode($locationIconSvg);
    $calendarIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>';
    $calendarIconBase64 = 'data:image/svg+xml;base64,' . base64_encode($calendarIconSvg);
    // BORESHO: Ongeza aikoni ya saa
    $clockIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    $clockIconBase64 = 'data:image/svg+xml;base64,' . base64_encode($clockIconSvg);
@endphp

@foreach ($purchase->tickets as $index => $ticket)
<div class="ticket">
    <!-- Sehemu ya Maelezo (Kushoto) -->
    <div class="ticket-stub">
        <div class="header">
            <div class="logo-container">
                <img src="{{ $logoBase64 }}" alt="Logo" class="stub-logo">
            </div>
            <div class="title-container">
                <h1 class="event-title">TAPHE AWARDS</h1>
                <h2 class="event-subtitle">Gala Night 2025</h2>
            </div>
        </div>
        <div class="stub-details">
            <div class="col">
                <p><strong>Attendee</strong> {{ $purchase->purchaser_name }}</p>
                <p><strong>Ticket Type</strong> {{ $purchase->ticketType->name }}</p>
            </div>
            <div class="col">
                <p><strong>Ticket ID</strong> <span class="ticket-code">{{ $ticket->ticket_code }}</span></p>
                <p><strong>Price</strong> TZS {{ number_format($purchase->ticketType->price, 0) }}/=</p>
            </div>
        </div>
        <!-- BORESHO: Kontena mpya ya kupanga meta na sponsors -->
        <div class="meta-container">
            <div class="event-meta">
                <!-- BORESHO: Tarehe, Muda, na Eneo vimepangwa kwenye safu moja (column) -->
                <p><img src="{{ $calendarIconBase64 }}" alt="Date" style="vertical-align: middle; margin-right: 8px;"> Saturday, 14th Dec 2025</p>
                <p><img src="{{ $clockIconBase64 }}" alt="Time" style="vertical-align: middle; margin-right: 8px;"> 06:00 PM</p>
                <p><img src="{{ $locationIconBase64 }}" alt="Location" style="vertical-align: middle; margin-right: 8px;"> Karimu Hall, Dar es Salaam</p>
            </div>
            @if (!empty($otherSponsorLogos))
            <div class="sponsors-footer">
                <strong>Our Sponsors:</strong>
                <div class="sponsors-logos">
                    @foreach (array_slice($otherSponsorLogos, 0, 3) as $sponsorLogo)
                        <div class="sponsor-logo">
                            <img src="{{ $sponsorLogo }}" alt="Sponsor" style="height: 20px; max-width: 60px; object-fit: contain;">
                        </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>
    </div>
    <!-- Sehemu ya QR Code (Kulia) -->
    <div class="ticket-main">
        <div class="qr-code">
            <img src="data:image/png;base64,{{ $qrCodes[$ticket->id] }}" alt="QR Code">
        </div>
        @if ($mainSponsorLogo)
        <div class="main-sponsor">
            <strong>Official Sponsor</strong>
            <img src="{{ $mainSponsorLogo }}" alt="Main Sponsor">
        </div>
        @endif
        <div class="footer-text">
            Ticket {{ $index + 1 }} of {{ $purchase->quantity }} <br>
            This ticket grants entry for one person. Not for resale. <br>
        </div>
    </div>
</div>
@endforeach
</body>
</html>

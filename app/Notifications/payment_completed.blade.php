@component('mail::message')
{{-- Header --}}
@slot('header')
@component('mail::header', ['url' => config('app.url')])
<img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name') }} Logo" style="max-width: 150px;">
@endcomponent
@endslot

# Malipo Yamefanikiwa!

Habari **{{ $purchase->purchaser_name }}**,

Asante kwa kununua tiketi za **TAPHE Awards**. Malipo yako yamepokelewa na tiketi zako ziko tayari.

@component('mail::panel')
**Muhtasari wa Manunuzi:**
* **Aina ya Tiketi:** {{ $purchase->ticketType->name }}
* **Idadi:** {{ $purchase->quantity }}
* **Jumla ya Bei:** TZS {{ number_format($purchase->total_amount, 0) }}/=
* **Namba ya Muamala:** {{ $purchase->transaction->order_id }}
@endcomponent

Tumekuambatanishia tiketi zako kwenye barua pepe hii katika muundo wa PDF. Tafadhali hakikisha unaipakua na kuja nayo siku ya tukio, iwe kwenye simu yako au ukiwa umeichapisha. Kila tiketi ina msimbo wa kipekee (QR Code) ambao utaskaniwa getini.

@component('mail::button', ['url' => route('tickets.download', ['order_id' => $purchase->transaction->order_id]), 'color' => 'gold'])
Pakua Tiketi Zako Hapa
@endcomponent

Asante,
<br>
Timu ya **{{ config('app.name') }}**

@component('mail::panel')
Kwa msaada zaidi au maswali, tafadhali wasiliana nasi kupitia <a href="mailto:info@tapheawards.co.tz">info@tapheawards.co.tz</a> au piga simu +255 749 562 993.
@endcomponent

@endcomponent
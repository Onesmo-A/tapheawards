@component('mail::message')
# Uthibitisho wa Usajili wa Marathon

Habari {{ $registration->full_name }},

Hongera! Tumepokea malipo yako na usajili wako wa **TAPHE Marathon** umekamilika.

Namba yako ya kipekee ya ushiriki ni: **{{ $registration->unique_code }}**.

Tafadhali hifadhi namba hii kwa ajili ya matumizi ya baadaye.

Tunakutakia maandalizi mema na tunatarajia kukuona siku ya mbio!

**Timu ya {{ config('app.name') }}**
@endcomponent


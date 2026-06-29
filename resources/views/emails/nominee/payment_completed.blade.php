@component('mail::message')
# Uthibitisho wa Malipo

Habari {{ $application->applicant_name }},

Tunapenda kukutaarifu kuwa tumepokea malipo yako kwa ajili ya ombi la ushiriki katika kategoria ya **"{{ $application->category->name }}"**.

Ombi lako sasa lipo kwenye hatua ya mapitio na timu yetu. Utapokea taarifa zaidi pindi mapitio yatakapokamilika.

Asante,

**Timu ya {{ config('app.name') }}**
@endcomponent


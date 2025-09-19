@component('mail::message')
# Tatizo la Malipo Kwenye Ombi Lako

Habari {{ $application->applicant_name }},

Tunasikitika kukutaarifu kuwa jaribio la malipo kwa ajili ya ombi lako la ushiriki katika kategoria ya **"{{ $application->category->name }}"** limeshindikana.

Tafadhali ingia kwenye akaunti yako na ujaribu kulipia tena.

@component('mail::button', ['url' => route('user.applications.show', $application->id)])
Angalia Ombi na Jaribu Tena
@endcomponent

Kama tatizo litaendelea, tafadhali wasiliana nasi.

**Timu ya {{ config('app.name') }}**
@endcomponent


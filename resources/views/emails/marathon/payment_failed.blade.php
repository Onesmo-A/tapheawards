@component('mail::message')
# Tatizo la Malipo ya Usajili wa Marathon

Habari {{ $registration->full_name }},

Tunasikitika kukutaarifu kuwa jaribio la malipo kwa ajili ya usajili wako wa **TAPHE Marathon** limeshindikana.

Tafadhali tembelea ukurasa wetu wa kuangalia hali ya usajili ili kujaribu tena.

@component('mail::button', ['url' => route('marathon.check-status-page')])
Angalia Hali ya Usajili
@endcomponent

Kama tatizo litaendelea, tafadhali wasiliana nasi.

**Timu ya {{ config('app.name') }}**
@endcomponent


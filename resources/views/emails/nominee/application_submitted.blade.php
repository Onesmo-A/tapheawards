@component('mail::message')
# Ombi Lako la Ushiriki Limepokelewa

Habari {{ $application->applicant_name }},

Asante kwa kuwasilisha ombi lako la kushiriki katika tuzo za **{{ config('app.name') }}** kwenye kategoria ya **"{{ $application->category->name }}"**.

Ujumbe wa kufanya malipo umetuumwa kwenye namba yako ya simu. Tafadhali kamilisha malipo ili ombi lako liweze kupitiwa.

Unaweza kufuatilia hali ya ombi lako kupitia akaunti yako.

@component('mail::button', ['url' => route('user.applications.show', $application->id)])
Fuatilia Ombi Lako
@endcomponent

Asante kwa kushiriki!
@endcomponent
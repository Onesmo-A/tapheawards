<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tuko Kwenye Matengenezo</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700,800&display=swap" rel="stylesheet" />

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Figtree', 'sans-serif'] },
                    keyframes: {
                        'fade-in-down': { 
                            '0%': { opacity: '0', transform: 'translateY(-20px)' }, 
                            '100%': { opacity: '1', transform: 'translateY(0)' } 
                        }
                    },
                    animation: { 'fade-in-down': 'fade-in-down 0.6s ease-out forwards' }
                },
            },
        }
    </script>
</head>
<body class="antialiased font-sans bg-gradient-to-br from-red-100 via-white to-red-200 text-gray-800">

<div class="min-h-screen flex flex-col justify-center items-center p-4">

    <!-- Logo -->
    <div class="mb-6 animate-fade-in-down" style="animation-delay: 100ms;">
        <a href="/">
            <img src="{{ asset('images/logo.png') }}" alt="Taphe Awards Logo"
                 class="h-20 w-auto rounded-full border-2 border-red-500 p-1.5 shadow-lg">
        </a>
    </div>

    <!-- Maintenance Card -->
    <div class="w-full sm:max-w-md px-6 py-8 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden sm:rounded-2xl text-center animate-fade-in-down" style="animation-delay: 200ms;">
        
        <div class="mb-5">
            <!-- Animated maintenance icon -->
            <svg class="mx-auto h-16 w-16 text-red-500 animate-pulse drop-shadow-md" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.192-.858l-2.496 3.03zM11.42 15.17L5.877 21A2.652 2.652 0 012.1 17.25l5.877-5.877m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 9.75l-4.5-4.5m0 0l-1.5 1.5m1.5-1.5l1.5-1.5m-1.5 1.5l-1.5-1.5M9 12l-1.5 1.5m1.5-1.5l1.5-1.5m-1.5 1.5l-1.5-1.5m1.5-1.5l1.5 1.5M12 9l1.5-1.5" />
            </svg>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Tunarudi Hivi Punde
        </h1>
        <p class="text-base sm:text-lg text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed">
            Samahani, tovuti yetu haipatikani kwa sasa. Tunafanya maboresho muhimu ili kukupa huduma bora zaidi.
        </p>

        <div class="border-t border-gray-200 pt-4">
            <p class="text-sm text-gray-500">
                Asante kwa uvumilivu wako.
            </p>
        </div>
    </div>

    <div class="mt-8 text-center text-xs text-gray-500 animate-fade-in-down" style="animation-delay: 300ms;">
        &copy; {{ date('Y') }} Taphe Awards. Haki zote zimehifadhiwa.
    </div>
</div>

</body>
</html>

import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                gold: {
                    '50': '#fffbeb',
                    '100': '#fef3c7',
                    '200': '#fde68a',
                    '300': '#fcd34d',
                    '400': '#fbbf24',
                    '500': '#f59e0b',
                    '600': '#d97706',
                    '700': '#b45309',
                    '800': '#92400e',
                    '900': '#78350f',
                    '950': '#451a03',
                },
            },
            backgroundImage: {
                'gradient-dark-blue': 'linear-gradient(180deg, #020422 0%, #010211 100%)',

                // 🌟 Realistic Modern Gold Gradient (Metallic Shine)
                'gold-gradient':
                    'linear-gradient(135deg, #f7e37c 0%, #f5d76e 20%, #f0c14b 40%, #d4af37 60%, #f0c14b 80%, #f7e37c 100%)',
            },
            keyframes: {
                fadeInUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'logo-glow': {
                    '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.3))' },
                    '50%': { filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.7))' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'logo-glow': 'logo-glow 3s ease-in-out infinite',
                'slide-in': 'slideIn 0.6s ease-in-out forwards',
            },
        },
    },

    plugins: [forms],
};

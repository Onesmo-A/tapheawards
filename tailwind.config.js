// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

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
                       50: '#ffffff',      // white
                    100: '#f9f9f9',
                    200: '#e5e5e5',
                    300: '#cccccc',
                    400: '#999999',
                    500: '#666666',
                    600: '#444444',
                    700: '#222222',     // black-ish
                    800: '#111111',
                    900: '#000000',     // true black
                },
                // 🌟 hii ndo ya muhimu
                accent: '#d82222ff', // Blue-600 (unaweza weka brand color ya TAPHE)
            },
            backgroundImage: {
                'gradient-dark-blue': 'linear-gradient(180deg, #ebe5e5ff 0%, #e3a9a9ff 100%)',
                'gold-gradient':
                    'linear-gradient(135deg, #f77c7cff 0%, #f56e6eff 20%, #f04b4bff 40%, #d43737ff 60%, #f04b4bff 80%, #f77c7cff 100%)',
            },
            keyframes: {
                fadeInUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'logo-glow': {
                    '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(212, 55, 55, 0.3))' },
                    '50%': { filter: 'drop-shadow(0 0 15px rgba(212, 55, 55, 0.7))' },
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
}

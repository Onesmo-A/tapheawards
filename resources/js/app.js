import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/app.css';
import './bootstrap';

import VueGtag from 'vue-gtag-next'; // <- hii ndio import muhimu
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h, ref } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import PageLoader from './Components/PageLoader.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// App Name from .env or fallback
const appName = import.meta.env.VITE_APP_NAME || 'TAPHE Awards';

// ------------------ Page Loader ------------------
const loading = ref(false);

// Tengeneza div ya loader na iongeze mwanzoni mwa body
const loaderEl = document.createElement('div');
loaderEl.id = 'page-loader';
document.body.appendChild(loaderEl);

// Mount Vue component ya PageLoader
createApp({
    setup() {
        return { loading };
    },
    render() {
        return this.loading ? h(PageLoader) : null;
    },
}).mount('#page-loader');

// Onyesha au ficha loader kulingana na matukio ya Inertia
router.on('start', () => (loading.value = true));
router.on('finish', () => (loading.value = false));
// ------------------ Mwisho Page Loader ------------------

// ------------------ Inertia App ------------------
createInertiaApp({
      title: (title) => {
        const appName = import.meta.env.VITE_APP_NAME || 'TAPHE Awards';
        return title ? `${title} - ${appName}` : appName;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'),
        ),
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
        .use(plugin)
        .use(ZiggyVue, Ziggy)
        .use(VueGtag, {
            property: {
                // id: "G-18TTWXZ8Q7", 
                // Your Google Analytics ID
            }
        })
      .use(Toast)  // <--- Ongeza hii hapa
        .mount(el); 
},

    progress: {
        color: '#f50909ff',      // Tailwind yellow-400
        showSpinner: true,     // Spinner enabled
        height: '8px',         // Bar height
    },
});
// ------------------ Mwisho Inertia App ------------------

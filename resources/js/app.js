import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/app.css';
import './bootstrap';

import VueGtag from 'vue-gtag-next';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h, ref } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import PageLoader from './Components/PageLoader.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// ------------------ Env Variables ------------------
const appName = import.meta.env.VITE_APP_NAME || 'TAPHE Awards';
const GA_ID = import.meta.env.VITE_GA_ID || null; // chukua GA ID kutoka .env

// ------------------ Page Loader ------------------
const loading = ref(false);
const loaderEl = document.createElement('div');
loaderEl.id = 'page-loader';
document.body.appendChild(loaderEl);

createApp({
    setup() {
        return { loading };
    },
    render() {
        return this.loading ? h(PageLoader) : null;
    },
}).mount('#page-loader');

router.on('start', () => (loading.value = true));
router.on('finish', () => (loading.value = false));

// ------------------ Inertia App ------------------
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue')
        ),
    setup({ el, App, props, plugin }) {
        const vueApp = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(Toast);

        // ------------------ Google Analytics SPA Tracking ------------------
 if (GA_ID) {
    vueApp.use(VueGtag, {
        property: { id: GA_ID }
    });

    // SPA pageviews tracking using Inertia events
    router.on('navigate', (event) => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: event.detail.page.url,
            });
        }
    });
}

        return vueApp.mount(el);
    },
    progress: {
        color: '#f50909ff',
        showSpinner: true,
        height: '8px',
    },
});

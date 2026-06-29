<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  siteKey: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    default: 'light',
  },
});

const emit = defineEmits(['verified', 'expired', 'error']);
const container = ref(null);
let widgetId = null;
let scriptPromise = null;

const loadScript = () => {
  if (typeof window !== 'undefined' && window.turnstile) {
    return Promise.resolve();
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-turnstile-script="true"]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Turnstile.'));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
};

const renderWidget = async () => {
  await loadScript();

  if (!window.turnstile || !container.value) {
    return;
  }

  widgetId = window.turnstile.render(container.value, {
    sitekey: props.siteKey,
    theme: props.theme,
    callback(token) {
      emit('verified', token);
    },
    'expired-callback'() {
      emit('expired');
    },
    'error-callback'() {
      emit('error');
    },
  });
};

onMounted(() => {
  renderWidget().catch(() => emit('error'));
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && window.turnstile && widgetId !== null) {
    try {
      window.turnstile.remove(widgetId);
    } catch (error) {
      // Ignore widget cleanup failures.
    }
  }
});
</script>

<template>
  <div ref="container" class="turnstile-widget"></div>
</template>

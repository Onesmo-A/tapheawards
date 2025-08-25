import { ref } from 'vue';
import axios from 'axios';

/**
 * Composable kwa ajili ya kushughulikia logiki ya upigaji kura.
 */
export function useVote() {
    const isLoading = ref(false);
    const message = ref('');
    const messageType = ref(''); // 'success' au 'error'

    const getFingerprintData = async () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const renderer = gl ? gl.getParameter(gl.RENDERER) : 'N/A';

        return {
            fingerprint_js: btoa(renderer + navigator.userAgent + navigator.language),
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
        };
    };

    const castVote = async (nomineeId) => {
        isLoading.value = true;
        message.value = '';
        messageType.value = '';

        try {
            const fingerprintData = await getFingerprintData();
            const response = await axios.post(`/vote/${nomineeId}`, fingerprintData);
            message.value = response.data.message;
            messageType.value = 'success';
            return true; // Kura imefanikiwa
        } catch (error) {
            message.value = error.response?.data?.message || 'Kuna tatizo la mtandao, jaribu tena.';
            messageType.value = 'error';
            // Rudisha true kama kosa ni "tayari ameshapiga kura" ili UI iweze kujizima
            return error.response?.status === 429;
        } finally {
            isLoading.value = false;
        }
    };

    return { isLoading, message, messageType, castVote };
}


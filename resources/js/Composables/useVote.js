import { ref } from 'vue';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useToast } from 'vue-toastification';

// Hii ni 'singleton promise' kuzuia script ya fingerprintjs isipakuliwe mara nyingi.
let fpPromise = null;

export function useVote() {
    const isLoading = ref(false);
    const message = ref('');
    const messageType = ref(''); // 'success' au 'error'
    const toast = useToast();

    const getFingerprintData = async () => {
        if (!fpPromise) {
            fpPromise = FingerprintJS.load();
        }
        const fp = await fpPromise;
        const result = await fp.get();
        return {
            fingerprint_js: result.visitorId,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
        };
    };

    const castVote = async (nomineeId) => {
        isLoading.value = true;
        message.value = '';
        messageType.value = '';
        let voteSucceeded = false;

        try {
            const fingerprintData = await getFingerprintData();
            const response = await axios.post(`/api/vote/${nomineeId}`, fingerprintData);

            toast.success(response.data.message);
            message.value = response.data.message;
            messageType.value = 'success';
            voteSucceeded = true;

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Kuna tatizo la mtandao limetokea.';
            toast.error(errorMessage);
            message.value = errorMessage;
            messageType.value = 'error';

            // Kama kosa ni "umeshapiga kura" (status 429), bado tunachukulia kama "mafanikio"
            // kwa upande wa UI ili component mama iweze kuzima vitufe vyote.
            if (error.response?.status === 429) {
                voteSucceeded = true;
            }
        } finally {
            isLoading.value = false;
        }

        return voteSucceeded;
    };

    return { isLoading, message, messageType, castVote };
}
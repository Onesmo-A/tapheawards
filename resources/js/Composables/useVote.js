import { ref } from 'vue';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useToast } from 'vue-toastification';

// Hii ni 'singleton promise' kuzuia script ya fingerprintjs isipakuliwe mara nyingi.
let fpPromise = null;
let behaviorTrackingStarted = false;
const behaviorState = {
    startedAt: Date.now(),
    mouseMoveCount: 0,
    scrollCount: 0,
    focusCount: 0,
    blurCount: 0,
};

const startBehaviorTracking = () => {
    if (behaviorTrackingStarted || typeof window === 'undefined') {
        return;
    }

    behaviorTrackingStarted = true;
    behaviorState.startedAt = Date.now();

    const increment = (key) => {
        behaviorState[key] += 1;
    };

    window.addEventListener('mousemove', () => increment('mouseMoveCount'), { passive: true });
    window.addEventListener('scroll', () => increment('scrollCount'), { passive: true });
    window.addEventListener('focus', () => increment('focusCount'));
    window.addEventListener('blur', () => increment('blurCount'));
};

const getBehaviorMetrics = () => {
    startBehaviorTracking();

    return {
        page_time_seconds: Math.max(0, Math.floor((Date.now() - behaviorState.startedAt) / 1000)),
        mouse_move_count: behaviorState.mouseMoveCount,
        scroll_count: behaviorState.scrollCount,
        focus_count: behaviorState.focusCount,
        blur_count: behaviorState.blurCount,
    };
};

export function useVote() {
    startBehaviorTracking();

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
            ...getBehaviorMetrics(),
        };
    };

    const fetchVoteSessionToken = async (nomineeId) => {
        const sessionResponse = await axios.get(`/nominees/${nomineeId}/vote-session`);

        return sessionResponse.data?.vote_session_token || '';
    };

    const isSecurityCheckError = (error) => {
        const status = error.response?.status;
        const messageText = String(error.response?.data?.message || '').toLowerCase();

        return status === 422 || (
            status === 403 && (
                messageText.includes('security check') ||
                messageText.includes('invalid or expired') ||
                messageText.includes('vote session')
            )
        );
    };

    const createNonce = () => (
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );

    const submitVote = async (nomineeId, fingerprintData, voteSessionToken, voteNonce, website) => {
        // Tumebadilisha URL ili ilingane na ile tuliyoiweka kwenye routes/web.php
        // Badala ya /api/vote/{id}, sasa ni /nominees/{id}/vote
        return axios.post(`/nominees/${nomineeId}/vote`, {
            ...fingerprintData,
            vote_session_token: voteSessionToken,
            vote_nonce: voteNonce,
            website,
        });
    };

    const castVote = async (nomineeId, security = {}) => {
        isLoading.value = true;
        message.value = '';
        messageType.value = '';
        let voteSucceeded = false;

        try {
            const fingerprintData = await getFingerprintData();
            let voteSessionToken = security.voteSessionToken || '';
            let voteNonce = security.voteNonce || createNonce();
            const website = security.website || '';

            if (!voteSessionToken) {
                voteSessionToken = await fetchVoteSessionToken(nomineeId);
            }

            let response;

            try {
                response = await submitVote(nomineeId, fingerprintData, voteSessionToken, voteNonce, website);
            } catch (error) {
                if (!isSecurityCheckError(error)) {
                    throw error;
                }

                voteSessionToken = await fetchVoteSessionToken(nomineeId);
                voteNonce = createNonce();
                response = await submitVote(nomineeId, fingerprintData, voteSessionToken, voteNonce, website);
            }

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

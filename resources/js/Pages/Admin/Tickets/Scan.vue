<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, CameraIcon } from '@heroicons/vue/24/solid';
// import PageHeader from '@/Components/Layout/PageHeader.vue';

const props = defineProps({
    title: String,
    stats: Object,
});

const scanner = ref(null);
const scanResult = ref(null);
const scanError = ref('');
const isScanning = ref(false);
const isLoading = ref(false);
const cameras = ref([]);
const lastScanTime = ref(0);

const resultDetails = computed(() => {
    if (!scanResult.value) return null;
    const status = scanResult.value.status;
    if (status === 'success') {
        return { icon: CheckCircleIcon, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', ringColor: 'ring-green-500' };
    }
    if (status === 'warning') {
        return { icon: ExclamationTriangleIcon, color: 'orange', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', ringColor: 'ring-yellow-500' };
    }
    if (status === 'error') {
        return { icon: XCircleIcon, color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', ringColor: 'ring-red-500' };
    }
    return { icon: CameraIcon, color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800', ringColor: 'ring-gray-500' };
});

const onScanSuccess = (decodedText, decodedResult) => {
    const now = Date.now();
    if (isLoading.value || now - lastScanTime.value < 3000) { // Cooldown ya sekunde 3
        return;
    }
    lastScanTime.value = now;

    navigator.vibrate(100); // Mtetemo kidogo
    isLoading.value = true;
    scanResult.value = null;
    scanError.value = '';

    axios.post(route('admin.tickets.verify'), { ticket_code: decodedText })
        .then(response => {
            scanResult.value = response.data;
        })
        .catch(error => {
            scanResult.value = error.response.data;
        })
        .finally(() => {
            isLoading.value = false;
            setTimeout(() => {
                scanResult.value = null;
            }, 10000); // BORESHO: Ongeza muda hadi sekunde 10
        });
};


const startScanner = () => {
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // SCAN_TYPE_CAMERA
    };
    scanner.value = new Html5Qrcode('qr-reader');
    scanner.value.start({ facingMode: "environment" }, config, onScanSuccess, (error) => { /* ignore failures */ })
        .then(() => {
            isScanning.value = true;
            scanError.value = '';
        })
        .catch(err => {
            console.error("Failed to start scanner", err);
            scanError.value = "Imeshindikana kuwasha kamera. Hakikisha umetoa ruhusa na unatumia HTTPS.";
        });
};

const stopScanner = () => {
    if (scanner.value && isScanning.value) {
        scanner.value.stop()
            .then(() => {
                isScanning.value = false;
            })
            .catch(err => {
                console.error("Failed to stop scanner", err);
            });
    }
};

onMounted(() => {
    Html5Qrcode.getCameras()
        .then(devices => {
            if (devices && devices.length) {
                cameras.value = devices;
                startScanner();
            } else {
                scanError.value = "Hakuna kamera iliyopatikana kwenye kifaa hiki.";
            }
        })
        .catch(err => {
            scanError.value = "Imeshindikana kupata kamera. Hakikisha umetoa ruhusa na unatumia HTTPS.";
        });
});

onUnmounted(() => {
    stopScanner();
});
</script>

<template>
    <Head :title="title" />
    <AdminLayout>
        <template #header>
            <!-- Header now hidden on small screens to give more space to the scanner -->
            <div class="hidden sm:block">
                <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
                <p class="text-gray-400">Elekeza kamera kwenye QR Code iliyo kwenye tiketi ya mgeni.</p>
            </div>
        </template>

        <!-- New layout for mobile-first scanner experience -->
        <div class="fixed inset-0 sm:relative sm:max-w-2xl sm:mx-auto sm:h-auto bg-gray-900 sm:bg-transparent">
            <div class="bg-black sm:rounded-2xl shadow-2xl overflow-hidden relative w-full h-full">
                <!-- Camera Viewport -->
                <div id="qr-reader" class="w-full h-full"></div>

                <!-- Camera Status Overlay -->
                <div v-if="!isScanning" class="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-4">
                    <CameraIcon class="h-16 w-16 mb-4" />
                    <p v-if="scanError" class="text-center text-red-400">{{ scanError }}</p>
                    <p v-else class="text-center">Inasubiri kamera...</p>
                    <button v-if="scanError" @click="startScanner" class="mt-4 btn-primary">Jaribu Kuwasha Kamera</button>
                </div>

                <!-- Scanner overlay -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-[250px] h-[250px] border-4 border-gold-400/70 rounded-2xl shadow-inner-strong"></div>
                </div>

                <!-- Stats Overlay -->
                <div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <div class="max-w-md mx-auto">
                        <div class="grid grid-cols-2 gap-4 text-white">
                            <div class="text-center bg-white/10 p-2 rounded-lg">
                                <p class="text-sm opacity-80">Wameingia</p>
                                <p class="text-2xl font-bold">{{ stats.checkedIn }}</p>
                            </div>
                            <div class="text-center bg-white/10 p-2 rounded-lg">
                                <p class="text-sm opacity-80">Jumla</p>
                                <p class="text-2xl font-bold">{{ stats.totalSold }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BORESHO: Eneo la matokeo sasa ni overlay katikati ya skrini -->
                <transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div v-if="isLoading || scanResult" class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                        <div v-if="isLoading" class="flex flex-col items-center justify-center text-gray-300">
                            <svg class="animate-spin h-10 w-10 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="mt-3 font-semibold text-lg">Inathibitisha...</p>
                        </div>

                        <div v-if="scanResult && resultDetails" :class="[resultDetails.bgColor, resultDetails.textColor]" class="w-full max-w-sm p-6 rounded-2xl shadow-2xl text-center">
                            <component :is="resultDetails.icon" class="mx-auto h-16 w-16 mb-4" />
                            <p class="text-2xl font-bold">{{ scanResult.message }}</p>
                            <div v-if="scanResult.ticket" class="mt-4 text-sm border-t pt-3 opacity-90" :class="`border-${resultDetails.color}-300/50`">
                                <p><strong>Mwenye Tiketi:</strong> {{ scanResult.ticket.ticket_purchase.purchaser_name }}</p>
                                <p><strong>Aina:</strong> {{ scanResult.ticket.ticket_purchase.ticket_type.name }}</p>
                                <p><strong>Namba:</strong> {{ scanResult.ticket.ticket_code }}</p>
                                <p v-if="scanResult.checked_in_time">
                                    <strong>Iliingia:</strong> {{ scanResult.checked_in_time }}
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Result Display (Original position removed, now handled by the overlay above) -->
        </div>
    </AdminLayout>
</template>

<style>
#qr-reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
}
#qr-reader__dashboard_section_csr > div {
    margin-top: 10px;
}
.shadow-inner-strong {
    box-shadow: inset 0 0 0 4px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.2);
}
</style>
<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { InformationCircleIcon, CheckCircleIcon, DevicePhoneMobileIcon, PhoneIcon } from '@heroicons/vue/24/outline';

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

function closeModal() {
  // Weka alama kwenye localStorage ili maelekezo yasionekane tena kwa mtumiaji huyu.
  localStorage.setItem('hasSeenVotingInstructions', 'true');
  emit('close');
}
</script>

<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="flex items-center text-2xl font-bold leading-6 text-yellow-400">
                <InformationCircleIcon class="h-7 w-7 mr-3" />
                Jinsi ya Kupiga Kura
              </DialogTitle>
              <div class="mt-4 space-y-4 text-gray-300">
                <p>
                  Ili kura yako ihesabiwe, tafadhali zingatia maelekezo yafuatayo:
                </p>
                <div class="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg flex items-start space-x-3">
                  <DevicePhoneMobileIcon class="h-8 w-8 flex-shrink-0 mt-1" />
                  <div>
                    <strong class="font-bold">Tumia Bando la Simu (Mobile Data)</strong>
                    <p class="mt-1">
                      Ikiwa unatumia Wi-Fi ya pamoja (kama ofisini au chuoni), unaweza kushindwa kupiga kura. Tafadhali <span class="underline">zima Wi-Fi na utumie bando lako la simu</span> kuhakikisha kura yako inapokelewa.
                    </p>
                  </div>
                </div>
                <div class="bg-gray-700/50 border border-gray-600 text-gray-200 px-4 py-3 rounded-lg flex items-start space-x-3">
                  <PhoneIcon class="h-8 w-8 flex-shrink-0 mt-1 text-yellow-400" />
                  <div>
                    <strong class="font-bold">Msaada Zaidi?</strong>
                    <p>Kama unahitaji msaada, wasiliana nasi: <strong class="text-white">+255 7433 331 626</strong></p>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <button type="button" class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-400 px-4 py-3 text-base font-bold text-black hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 transition-transform transform hover:scale-105" @click="closeModal">
                  <CheckCircleIcon class="w-5 h-5 mr-2" />
                  Nimeelewa, Endelea Kupiga Kura
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  endDate: {
    type: String,
    required: true,
  },
})

const votingEndDate = computed(() => new Date(props.endDate))
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const isVotingOver = ref(false)

let intervalId

const updateCountdown = () => {
  const now = new Date().getTime()
  const timeDifference = votingEndDate.value.getTime() - now

  if (timeDifference <= 0) {
    isVotingOver.value = true
    clearInterval(intervalId)
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const formatNumber = (num) => num.toString().padStart(2, '0')
const getProgress = (value, max) => (value / max) * 100
</script>

<template>
  <div class="bg-gray-900 text-white pt-4 sm:py-24 flex flex-col">
    <!-- Countdown Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 v-if="!isVotingOver" class="text-3xl md:text-4xl font-extrabold text-primary-gradient drop-shadow-glow mb-2">
        Voting Closes In
      </h2>
      <p v-if="!isVotingOver" class="text-sm sm:text-lg text-gray-400 max-w-xl mx-auto mb-2 sm:mb-6">
        Don't miss your chance to support your favorite nominees!
      </p>

      <div
        v-if="!isVotingOver"
        class="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-10 gap-x-4 md:gap-x-20 max-w-full mx-auto"
      >
        <div
          v-for="(value, label) in {
            Days: days,
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds
          }"
          :key="label"
          class="flex flex-col items-center justify-center"
        >
          <div class="relative w-32 sm:w-40 md:w-56 h-32 sm:h-40 md:h-56">
            <svg
              viewBox="0 0 160 160"
              class="absolute top-0 left-0 w-full h-full transform -rotate-90"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                class="text-gray-700"
                stroke="currentColor"
                stroke-width="15"
                fill="transparent"
                r="65"
                cx="80"
                cy="80"
              />
              <circle
                class="text-red-500 transition-all duration-500"
                :stroke-dasharray="408"
                :stroke-dashoffset="408 - (getProgress(value, label === 'Days' ? 365 : label === 'Hours' ? 24 : 60) / 100) * 408"
                stroke-linecap="round"
                stroke-width="15"
                fill="transparent"
                stroke="currentColor"
                r="65"
                cx="80"
                cy="80"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <Transition name="tick" mode="out-in">
                <span
                  :key="value"
                  class="text-4xl sm:text-5xl md:text-7xl font-bold text-primary-gradient bg-clip-text text-transparent"
                >
                  {{ formatNumber(value) }}
                </span>
              </Transition>
            </div>
          </div>
          <span class="text-xs sm:text-sm md:text-lg font-medium text-gray-300 uppercase tracking-widest">
            {{ label }}
          </span>
        </div>
      </div>

      <div v-else class="mt-8">
        <h3 class="text-2xl md:text-4xl font-extrabold text-primary-gradient drop-shadow-glow mb-4">
          Voting Has Ended!
        </h3>
        <p class="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto">
          Thank you for participating. Winners will be announced soon.
          <br />
          Follow us on Social Media
          <a href="https://www.instagram.com/businessawards_2024/" target="_blank" class="text-primary-gradient underline">
            businessawards_2024
          </a>
        </p>
        <!-- Button to Event Location -->
        <div class="mt-8">
          <a href="#event-location" class="btn-primary">
            View Event Location on Google Maps
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-2 sm:mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-gray-700 pt-2">
      <p class="text-gray-400 text-xs sm:text-sm">
        Powered by
        <a
          href="https://wa.me/255743331626"
          target="_blank"
          class="font-semibold text-primary-gradient hover:text-white transition"
        >
          Native Technology Tz
        </a>
      </p>
      <div class="flex justify-center space-x-4 text-lg mt-2">
        <a
          href="https://www.instagram.com/nativetechnology_tz/"
          target="_blank"
          aria-label="Instagram"
          class="text-red-500 hover:text-white transition"
        >
          <i class="fab fa-instagram"></i>
        </a>
        <a
          href="https://wa.me/255743331626"
          target="_blank"
          aria-label="WhatsApp"
          class="text-green-500 hover:text-white transition"
        >
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tick-enter-active,
.tick-leave-active {
  transition: all 0.4s ease-in-out;
}
.tick-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.tick-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
svg {
  width: 100%;
  height: 100%;
}
circle {
  transition: stroke-dashoffset 0.5s ease;
}
</style>

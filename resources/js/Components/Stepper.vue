<script setup>
defineProps({
  steps: {
    type: Array,
    required: true, // e.g., ['Select Category', 'Fill Form', 'Status']
  },
  currentStep: {
    type: Number,
    required: true, // 1-based index
  },
});
</script>

<template>
  <nav aria-label="Progress">
    <ol
      role="list"
      class="rounded-md border md:flex md:divide-y-0
             bg-gray-800/40 border-gray-700 divide-y divide-gray-700"
    >
      <li v-for="(step, stepIdx) in steps" :key="step" class="relative md:flex md:flex-1">
        <!-- Completed -->
        <div v-if="stepIdx < currentStep - 1" class="group flex w-full items-center">
          <span class="flex items-center px-6 py-4 text-sm font-medium">
            <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600">
              <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
              </svg>
            </span>
            <span class="ml-4 text-sm font-medium text-gray-100">{{ step }}</span>
          </span>
        </div>

        <!-- Current -->
        <div v-else-if="stepIdx === currentStep - 1" class="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
          <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-400">
            <span class="text-indigo-300 font-semibold">{{ stepIdx + 1 }}</span>
          </span>
          <span class="ml-4 text-sm font-medium text-indigo-300">{{ step }}</span>
        </div>

        <!-- Upcoming -->
        <div v-else class="group flex items-center">
          <span class="flex items-center px-6 py-4 text-sm font-medium">
            <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-600">
              <span class="text-gray-400">{{ stepIdx + 1 }}</span>
            </span>
            <span class="ml-4 text-sm font-medium text-gray-400">{{ step }}</span>
          </span>
        </div>

        <!-- Separator (desktop) -->
        <template v-if="stepIdx < steps.length - 1">
          <div class="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
            <svg class="h-full w-full text-gray-700" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
              <path d="M0.5 0H21.5V80H0.5V0Z" fill="currentColor" />
            </svg>
          </div>
        </template>
      </li>
    </ol>
  </nav>
</template>

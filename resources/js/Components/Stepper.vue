<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <nav aria-label="Progress" class="mb-8 md:mb-12">
    <ol role="list" class="space-y-4 md:flex md:space-x-8 md:space-y-0">
      <li v-for="step in steps" :key="step.name" class="md:flex-1">
        <div
          class="group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
          :class="[
            step.status === 'current'
              ? 'border-blue-600'
              : step.status === 'complete'
                ? 'border-green-600'
                : 'border-gray-200',
            step.status === 'upcoming' ? 'hover:border-gray-300' : ''
          ]"
        >
          <span
            class="text-sm font-medium"
            :class="[
              step.status === 'current'
                ? 'text-blue-600'
                : step.status === 'complete'
                  ? 'text-green-600'
                  : 'text-gray-500 group-hover:text-gray-700'
            ]"
          >
            {{ step.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

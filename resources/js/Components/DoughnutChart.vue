<script setup>
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';
import { computed } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
  },
});

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#9CA3AF', // gray-400
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.raw.toLocaleString()}`;
        }
      }
    },
  },
};

const computedOptions = computed(() => {
  return { ...defaultOptions, ...props.chartOptions };
});
</script>

<template>
  <Doughnut :data="chartData" :options="computedOptions" />
</template>
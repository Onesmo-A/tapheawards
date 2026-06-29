<script setup>
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { computed } from 'vue';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
  },
  chartType: {
    type: String,
    default: 'bar', // 'bar' or 'line'
  }
});

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1F2937', // gray-800
      titleColor: '#D4AF37', // gold-400
      bodyColor: '#D1D5DB', // gray-300
      borderColor: '#D4AF37',
      borderWidth: 1,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#374151', // gray-700
      },
      ticks: {
        color: '#9CA3AF', // gray-400
        precision: 0,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#9CA3AF', // gray-400
      },
    },
  },
};

const computedOptions = computed(() => {
  return { ...defaultOptions, ...props.chartOptions };
});
</script>

<template>
  <component :is="chartType === 'line' ? Line : Bar" :data="chartData" :options="computedOptions" />
</template>
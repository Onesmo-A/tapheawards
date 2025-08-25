<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Votes per Category',
      color: '#E5E7EB', // gray-200
      font: {
        size: 16,
      },
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
        color: 'rgba(255, 255, 255, 0.1)',
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
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
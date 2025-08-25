<script setup>
import VoteButton from '@/Components/VoteButton.vue';

defineProps({
    nominee: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group flex flex-col">
        <div class="relative">
            <img class="w-full h-64 object-cover object-top" :src="nominee.image_url" :alt="nominee.name" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
             <h3 class="absolute bottom-0 left-0 p-4 text-2xl font-bold text-white drop-shadow-lg">{{ nominee.name }}</h3>
        </div>
        <div class="p-6 flex flex-col justify-between flex-grow">
            <p class="text-gray-300 text-sm leading-relaxed mb-4 min-h-[60px]">{{ nominee.bio }}</p>
            <VoteButton :nominee="nominee" />
        </div>
    </div>
</template>
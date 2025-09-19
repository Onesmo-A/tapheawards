<template>
    <div v-if="reels && reels.length > 0" class="bg-gray-900 py-12 sm:py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-gold-400 sm:text-4xl">TAPHE Reels</h2>
                <p class="mt-2 text-lg leading-8 text-gray-300">Tazama matukio muhimu na ya kusisimua kupitia reels zetu za Instagram.</p>
            </div>
            <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <article v-for="reel in reels" :key="reel.id" class="flex flex-col items-start justify-between">
                    <div class="relative w-full">
                        <div class="aspect-[9/16] w-full overflow-hidden rounded-2xl bg-gray-800">
                            <!-- Instagram Embed -->
                            <iframe
                                class="h-full w-full"
                                :src="`https://www.instagram.com/p/${reel.content}/embed`"
                                frameborder="0"
                                allowfullscreen
                                scrolling="no">
                            </iframe>
                        </div>
                    </div>
                    <div class="max-w-xl">
                        <div class="group relative">
                            <h3 class="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                                <a :href="`https://www.instagram.com/p/${reel.content}/`" target="_blank">
                                    <span class="absolute inset-0" />
                                    {{ reel.title }}
                                </a>
                            </h3>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    reels: Array,
});
</script>
<template>
    <!-- BORESHO: Imeongezwa Splide kwa ajili ya carousel -->
    <!-- REKEBISHO: Muundo umesahihishwa ili Splide ifanye kazi vizuri -->
    <div v-if="reels && reels.length > 0" class="bg-gray-900 py-12 sm:py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Release and TAPHE Reels</h2>
                <p class="mt-2 text-lg leading-8 text-gray-300">Tazama matukio muhimu na ya kusisimua kupitia reels zetu za Instagram.</p>
            </div>
            <Splide :options="splideOptions" aria-labelledby="reels-heading" class="mt-16">
                <SplideSlide v-for="reel in reels" :key="reel.id">
                    <article class="flex flex-col items-start justify-between h-full mx-2">
                    <div class="relative w-full">
                        <div class="aspect-[9/16] w-full overflow-hidden rounded-2xl bg-gray-800">
                            <!-- Instagram Embed -->
                            <iframe class="h-full w-full" :src="`https://www.instagram.com/p/${getInstagramPostId(reel.content)}/embed`" frameborder="0" allowfullscreen scrolling="no">
                            </iframe>
                        </div>
                    </div>
                    <div class="max-w-xl">
                        <div class="group relative">
                            <h3 class="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                                <a :href="reel.content" target="_blank">
                                    <span class="absolute inset-0" />
                                    {{ reel.title }}
                                </a>
                            </h3>
                        </div>
                    </div>
                </article>
                </SplideSlide>
            </Splide>
        </div>
    </div>
</template>

<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

defineProps({
    reels: Array,
});

const splideOptions = {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    gap: '1rem',
    autoplay: true,
    interval: 5000,
    pauseOnHover: true,
    breakpoints: {
        1024: { perPage: 2 },
        768: { perPage: 1 },
    },
};

const getInstagramPostId = (url) => {
    if (!url) return '';
    try {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/').filter(part => part);
        const reelIndex = pathParts.findIndex(part => part === 'reel' || part === 'p');
        return reelIndex !== -1 && pathParts[reelIndex + 1] ? pathParts[reelIndex + 1] : '';
    } catch (e) {
        return '';
    }
};
</script>
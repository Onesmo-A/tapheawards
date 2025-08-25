<script setup>
// Data for artists can be hardcoded for now or passed as props later.
const artists = [
  {
    name: 'Diamond Platnumz',
    genre: 'Bongo Flava Superstar',
    image: '/images/artists/diamond.jpg',
  },
  {
    name: 'Zuchu',
    genre: 'Queen of Bongo Flava',
    image: '/images/artists/zuchu.jpg',
  },
  {
    name: 'Ali Kiba',
    genre: 'King of Melodies',
    image: '/images/artists/alikiba.jpg',
  },
  {
    name: 'Nandy',
    genre: 'The African Princess',
    image: '/images/artists/nandy.jpg',
  },
];
</script>

<template>
    <section 
        class="will-animate-section relative py-20 sm:py-32 text-white overflow-hidden bg-cover bg-center bg-fixed"
        style="background-image: url('/images/backgrounds/artists-bg.jpg');"
    >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Live Performances By</h2>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
                    Our Star-Studded Lineup
                </p>
            </div>

            <!-- Artists Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                <div
                    v-for="(artist, index) in artists"
                    :key="artist.name"
                    class="group relative text-center animate-child-on-visible opacity-0"
                    :style="{ 'transition-delay': (400 + index * 150) + 'ms' }"
                >
                    <div class="relative aspect-square w-full overflow-hidden rounded-full mx-auto max-w-[250px] border-4 border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-300">
                        <img :src="artist.image" :alt="artist.name" class="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>
                    </div>
                    <div class="mt-6">
                        <h3 class="text-2xl font-bold text-white">{{ artist.name }}</h3>
                        <p class="text-yellow-400">{{ artist.genre }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animations that trigger when the parent .is-visible class is added */
.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
    transform: translateY(40px);
}
</style>
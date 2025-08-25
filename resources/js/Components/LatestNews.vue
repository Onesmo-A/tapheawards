<script setup>
const articles = [
  {
    category: 'Announcements',
    title: 'Voting Lines Are Officially Open for TBA 2025!',
    image: '/images/news/news-1.jpeg',
    link: '#',
    date: 'July 08, 2025',
    excerpt: 'The moment you\'ve been waiting for is here. Cast your vote now and support your favorite businesses and entrepreneurs...'
  },
  {
    category: 'Behind the Scenes',
    title: 'Meet the Jury: The Experts Behind the Awards',
    image: '/images/news/news-2.jpeg',
    link: '#',
    date: 'July 05, 2025',
    excerpt: 'We are proud to introduce the esteemed panel of judges who will be evaluating the nominees for this year\'s awards...'
  },
  {
    category: 'Event Update',
    title: 'Gala Night Tickets Now Available for Purchase',
    image: '/images/news/news-3.jpeg',
    link: '#',
    date: 'July 01, 2025',
    excerpt: 'Secure your spot at the most anticipated business event of the year. Limited tickets available, get yours today...'
  },
];
</script>

<template>
    <section class="will-animate-section bg-black py-20 sm:py-32 text-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Stay Informed</h2>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
                    Latest News & Updates
                </p>
            </div>

            <!-- News Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article
                    v-for="(article, index) in articles"
                    :key="index"
                    class="group flex flex-col bg-gray-900/50 rounded-xl overflow-hidden shadow-lg border border-yellow-400/20 animate-child-on-visible opacity-0"
                    :style="{ 'transition-delay': (400 + index * 150) + 'ms' }"
                >
                    <div class="relative">
                        <img :src="article.image" :alt="article.title" class="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div class="flex flex-col flex-grow p-6">
                        <div class="flex-grow">
                            <div class="flex justify-between items-center text-sm mb-2">
                                <p class="font-semibold text-yellow-400 uppercase">{{ article.category }}</p>
                                <time class="text-gray-400">{{ article.date }}</time>
                            </div>
                            <h3 class="text-xl font-bold text-white leading-tight mb-3">
                                <a :href="article.link" class="hover:text-yellow-300 transition-colors duration-300">{{ article.title }}</a>
                            </h3>
                            <p class="text-gray-400 leading-relaxed">{{ article.excerpt }}</p>
                        </div>
                        <div class="mt-6">
                            <a :href="article.link" class="font-bold text-yellow-400 hover:text-yellow-200 transition-colors duration-300 flex items-center gap-2">
                                Read More <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </article>
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

.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
    transform: translateY(40px);
}
</style>
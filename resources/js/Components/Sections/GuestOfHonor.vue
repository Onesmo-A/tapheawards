<script setup>
// This component is self-contained for now.
// Data can be passed via props later if needed.
</script>

<template>
    <section class="will-animate-section bg-black py-20 sm:py-32 text-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
      <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms">
        <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">An Evening With</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient">
                    Our Guest of Honor
                </p>
            </div>

            <!-- Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                <!-- Image Side -->
                <div class="lg:col-span-2 relative animate-child-on-visible opacity-0 animate-from-left" style="transition-delay: 400ms;">
          <div class="aspect-[3/4] relative group">
            <div class="absolute -inset-4 border-2 border-[var(--accent-color)]/30 rounded-2xl rotate-3 transition-transform duration-500 group-hover:rotate-0"></div>
            <img src="/images/guest-of-honor.jpg" alt="Guest of Honor, Hon. Dr. Jakaya Mrisho Kikwete" class="relative w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/50">
          </div>
                </div>

                <!-- Text Side -->
                <div class="lg:col-span-3 animate-child-on-visible opacity-0 animate-from-right" style="transition-delay: 600ms;">
                    <h3 class="text-4xl font-bold tracking-tight text-white">Hon. Dr. Jakaya Mrisho Kikwete</h3>
          <p class="text-xl mt-2 font-semibold" style="color: var(--accent-color)">4th President of the United Republic of Tanzania</p>
          <blockquote class="mt-8 text-lg text-gray-300 leading-relaxed border-l-4 pl-6 italic" style="border-color: var(--accent-color)">
                        "The future of Tanzania lies in the hands of its innovative entrepreneurs and resilient businesses. Events like these are crucial for recognizing their contribution and inspiring the next generation to dream bigger and build a stronger economy for all."
                    </blockquote>
                    <p class="mt-6 text-gray-400">
                        We are deeply honored to have His Excellency Dr. Jakaya Mrisho Kikwete, a statesman of immense experience and a champion for economic growth, grace our event as the Guest of Honor.
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Animations that trigger when the parent .is-visible class is added */
.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0) translateX(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible { transform: translateY(30px); }
.animate-child-on-visible.animate-from-left { transform: translateX(-50px); }
.animate-child-on-visible.animate-from-right { transform: translateX(50px); }
</style>
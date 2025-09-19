<script setup>
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { BuildingOffice2Icon, HeartIcon } from '@heroicons/vue/24/outline';

const sectionRef = ref(null);

onMounted(() => {
  // Logic to add 'is-visible' class when the section enters the viewport for animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing after it becomes visible
        }
      });
    },
    { threshold: 0.1 } // Trigger animation when 10% of section is visible
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<template>
  <div class="bg-background-section overflow-hidden">
    <div class="mx-auto max-w-7xl">
      <div class="lg:flex">
        <!-- Text Section -->
        <div ref="sectionRef" class="relative lg:w-1/2 will-animate-section px-6 py-16 sm:py-24 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h2 class="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
             Sponsorship Opportunities
            </h2>
            <p class="text-base font-semibold leading-7 text-accent-secondary">Join Us in Sponsoring Health Heroes - Showcase Your Brand</p>
           
            <p class="mt-6 text-lg leading-8 text-text-secondary">
              By sponsoring the TAPHE Awards, you demonstrate your commitment to excellence in Tanzania’s health sector. Gain a unique opportunity to connect with experts, policymakers, and innovators driving meaningful change.
            </p>
            <ul role="list" class="mt-8 space-y-6 text-text-secondary">
              <li class="flex gap-x-3">
                <BuildingOffice2Icon class="mt-1 h-5 w-5 flex-none text-accent" aria-hidden="true" />
                <span><strong class="font-semibold text-text-primary">Brand Visibility.</strong> Deliver your message to a targeted audience of health professionals and leaders.</span>
              </li>
              <li class="flex gap-x-3">
                <HeartIcon class="mt-1 h-5 w-5 flex-none text-accent" aria-hidden="true" />
                <span><strong class="font-semibold text-text-primary">Partnership & Impact.</strong> Associate your brand with a prestigious event recognizing critical contributions to society.</span>
              </li>
            </ul>
            <div class="mt-10 flex">
              <Link :href="route('sponsors.index')" class="btn-primary">
                View Sponsorship Opportunities
              </Link>
            </div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="relative h-80 lg:w-1/2 lg:h-auto">
          <img class="absolute inset-0 h-full w-full object-cover" src="/images/sponsorship-promo.jpg" alt="Doctors and nurses collaborating in a modern hospital environment." />
          <!-- Gradient Overlay for better visual -->
          <div class="absolute inset-0 bg-gradient-to-t from-background-section via-background-section/50 to-transparent lg:bg-gradient-to-r"></div>
        </div>
      </div>
    </div>
  </div>
</template>

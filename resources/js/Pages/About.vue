<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';

defineOptions({
  layout: DefaultLayout,
});


defineProps({
  title: String,
  description: String,
});
</script>

<template>
  <Head :title="title" />
  <AppHeader />

  <main>
    <!-- Page Header with Breadcrumb -->
    <PageHeader :title="title" class=" pt-24 sm:pt-32 " />

    <!-- About Content Section -->
    <section class="py-20 sm:py-32 bg-[var(--background-section)] a">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Image -->
          <div class="group">
           
            <img src="/images/about-us.jpg" alt="Health Awards Event" 
                 class="rounded-xl shadow-primary-glow border-2 border-[var(--accent-primary)] group-hover:shadow-primary-glow transition-shadow duration-300">
          
            <img src="/images/about-us2.jpg" alt="Health Awards Event" 
                 class="rounded-xl shadow-primary-glow border-2 border-[var(--accent-primary)] group-hover:shadow-primary-glow transition-shadow duration-300 mt-8">
          
          </div>
          
          <!-- Right Content -->
          <div>
            <h2 class="text-base font-semibold leading-7 uppercase text-[var(--accent-primary)]">Our Mission</h2>
            <p class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-primary-gradient">
              Celebrating Excellence in Tanzania’s Health Sector
            </p>
            
            <p class="mt-8 text-lg text-[var(--text-primary)] leading-8">
              The Health Awards were established to recognize and honor outstanding achievements of individuals, institutions, and professionals in the healthcare sector across Tanzania. Our mission is to foster excellence, innovation, and integrity in healthcare services at every level.
            </p>

            <p class="mt-6 text-lg text-[var(--text-primary)] leading-8">
              Each year, we bring together healthcare leaders, medical practitioners, innovators, and key stakeholders to celebrate those who have demonstrated exceptional dedication, leadership, and contribution to improving health outcomes and advancing the healthcare system in Tanzania.
            </p>

            <!-- BORESHO: Muundo mpya wa Testimonials -->
            <div class="mt-12 space-y-8">
              <!-- Testimonial 1 -->
              <figure class="rounded-xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5">
                <blockquote class="text-gray-700">
                  <p>“We are honored to welcome patients from across Africa who choose our hospitals for medical treatments and surgeries, a remarkable achievement in this sector.”</p>
                </blockquote>
                <figcaption class="mt-6 flex items-center gap-x-4">
                  <img class="h-12 w-12 rounded-full bg-gray-200 object-cover" src="/images/testimonials/saad-mtambule.jpg" alt="Hon. Saad Mtambule">
                  <div>
                    <div class="font-semibold text-text-primary">Hon. Saad Mtambule</div>
                    <div class="text-gray-600">District Commissioner, Kinondoni District</div>
                  </div>
                </figcaption>
              </figure>
              <!-- Testimonial 2 -->
              <figure class="rounded-xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5">
                <blockquote class="text-gray-700">
                  <p>“Participating in the Tanzania People’s Health Excellence (TAPHE) Awards offers more than just the chance to win trophies, it provides hospitals and individual professionals with significant public recognition and visibility.”</p>
                </blockquote>
                <figcaption class="mt-6 flex items-center gap-x-4">
                  <img class="h-12 w-12 rounded-full bg-gray-200 object-cover" src="/images/testimonials/karim-haji.jpg" alt="Mr. Karim S. Haji">
                  <div>
                    <div class="font-semibold text-text-primary">Mr. Karim S. Haji</div>
                    <div class="text-gray-600">Director - WICoL</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped></style>

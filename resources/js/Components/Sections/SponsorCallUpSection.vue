<script setup>
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';

const sectionRef = ref(null);

onMounted(() => {
  // Hii ni logic ya kuongeza class ya 'is-visible' pale component
  // inapoonekana kwenye skrini, ili kuleta uhuishaji (animation).
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Acha kuangalia baada ya kuonekana
        }
      });
    },
    { threshold: 0.1 } // Anza animation pindi 10% ya section inapoonekana
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden bg-background-section py-16 sm:py-24 will-animate-section"
  >
    <!-- Maumbo ya mapambo (Decorative shapes) -->
    <div aria-hidden="true" class="absolute inset-0 -z-10">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style="width: 80%; max-width: 64rem;">
            <div class="aspect-[1155/678] w-full bg-gradient-to-tr from-accent-secondary to-accent-primary opacity-10" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
        </div>
    </div>

    <div class="relative z-10 container mx-auto px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold tracking-tight text-accent sm:text-4xl drop-shadow-title">
        Saidia Kutambua Mashujaa wa Afya
      </h2>
      <p class="mt-6 text-lg leading-8 text-text-secondary max-w-3xl mx-auto">
        Ungana nasi katika kuwapongeza na kuwatambua watoa huduma za afya Tanzania kwa kazi yao ya kujitolea. Udhamini wako utawezesha tukio hili la kipekee, kukuunganisha na viongozi na wadau muhimu katika sekta ya afya, na kuipa chapa yako muonekano unaoendana na utu na heshima.
      </p>
      <div class="mt-10 flex items-center justify-center">
        <Link href="/sponsorship" class="btn-primary"> Jifunze Kuhusu Udhamini </Link>
      </div>
    </div>
  </section>
</template>

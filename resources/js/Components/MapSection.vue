<script setup>
// No script needed
</script>

<template>
    <section 
        class="will-animate-section relative py-20 sm:py-32 text-white overflow-hidden bg-cover bg-center bg-fixed"
        style="background-image: url('/images/backgrounds/map-bg.jpg');"
    >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Event Location</h2>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
                    Find Your Way to the Gala
                </p>
            </div>

            <!-- Map and Details Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <!-- Map -->
                <div class="lg:col-span-2 h-96 lg:h-[500px] rounded-xl overflow-hidden border-2 border-yellow-400/30 shadow-2xl shadow-yellow-500/10 animate-child-on-visible opacity-0" style="transition-delay: 400ms;">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.866993952229!2d39.27909481477224!3d-6.785864995100085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b0b9b3b8e7b%3A0x4559551f398885a!2sJulius%20Nyerere%20International%20Convention%20Centre!5e0!3m2!1sen!2stz!4v1690000000000"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="grayscale-[80%] invert-[90%] contrast-[1.2]"
                    ></iframe>
                </div>

                <!-- Details -->
                <div class="animate-child-on-visible opacity-0" style="transition-delay: 600ms;">
                    <div class="bg-gray-900/50 p-8 rounded-xl border border-yellow-400/20">
                        <h3 class="text-3xl font-bold text-white mb-4">Event Venue</h3>
                        <p class="text-xl font-semibold text-yellow-400">
                            Julius Nyerere International Convention Centre
                        </p>
                        <p class="text-gray-300 mt-2">Shaaban Robert St, Dar es Salaam, Tanzania</p>

                        <div class="mt-8 pt-6 border-t border-yellow-400/20 space-y-4">
                            <div>
                                <h4 class="font-bold text-white">Date</h4>
                                <p class="text-gray-300">December 15th, 2025</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-white">Time</h4>
                                <p class="text-gray-300">7:00 PM - Late</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-white">Dress Code</h4>
                                <p class="text-gray-300">Black Tie / Formal</p>
                            </div>
                        </div>
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

.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
    transform: translateY(40px);
}
</style>
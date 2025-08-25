<script setup>
// No script needed
</script>

<template>
    <section id="event-location" class="will-animate-section relative py-20 sm:py-32 text-white overflow-hidden scroll-mt-20">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 " style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">Event Location</h2>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient ">
                    Find Your Way to the Gala
                </p>
            </div>

            <!-- Map and Details Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <!-- Map --> 
                <div class="lg:col-span-2 h-96 lg:h-[500px] rounded-xl overflow-hidden border-2 border-[var(--accent-color)]/30 shadow-2xl shadow-black/50 "
                    style="transition-delay: 400ms;">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.615418641097!2d39.221826173270614!3d-6.694463065445446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c513cdf54add7%3A0xa978799e076b4e6d!2sBLUE%20SAPPHIRE%20HALL!5e0!3m2!1sen!2stz!4v1752858907617!5m2!1sen!2stz"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="grayscale-[80%] invert-[90%] contrast-[1.2]"
                    </iframe>
                </div>

                <!-- Details -->
                <div class="" style="transition-delay: 600ms;">
                    <div class="bg-gray-900/50 p-8 rounded-xl border border-[var(--accent-color)]/20">
                        <h3 class="text-3xl font-bold text-white mb-4">Event Venue</h3>
                        <p class="text-xl font-semibold" style="color: var(--accent-color)">
                            Blue Sapphire Hall
                        </p>
                        <p class="text-gray-300 mt-2">Mbezi Beach, Dar es Salaam, Tanzania</p>

                        <div class="mt-8 pt-6 border-t border-[var(--accent-color)]/20 space-y-4">
                            <div>
                                <h4 class="font-bold text-white">Date</h4>
                                <p class="text-gray-300">August 7th, 2025</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-white">Time</h4>
                                <p class="text-gray-300">7:00 PM - Late</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-white">Dress Code</h4>
                                <p class="text-gray-300">Brown, Black</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
    transform: translateY(40px);
}
</style>
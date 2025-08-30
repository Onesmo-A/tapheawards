<script setup>
// No script needed
</script>

<template>
    <section id="event-location" class="will-animate-section scroll-mt-20 overflow-hidden bg-background-section py-20 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <!-- Section Header -->
            <div class="mb-16 text-center" style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold uppercase leading-7 text-text-accent">Event Location</h2>
                <p class="text-primary-gradient mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    Join Us at the Gala
                </p>
            </div>

            <!-- Map and Details Grid -->
            <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <!-- Map --> 
                <div class="h-96 overflow-hidden rounded-xl border-2 border-[var(--accent-primary)]/30 shadow-lg lg:col-span-2 lg:h-[500px]"
                    style="transition-delay: 400ms;">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.857080196155!2d39.28633157678559!3d-6.815401065498404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b72d5c2df3f%3A0x6bb2a420c9fbcf76!2sJulius%20Nyerere%20International%20Convention%20Centre%20(JNICC)!5e0!3m2!1sen!2stz!4v1753879999999!5m2!1sen!2stz"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <!-- Details -->
                <div class="" style="transition-delay: 600ms;">
                    <div class="rounded-xl border border-[var(--accent-primary)]/20 bg-background-main p-8 shadow-lg">
                        <h3 class="mb-4 text-3xl font-bold text-text-primary">Event Venue</h3>
                        <p class="text-xl font-semibold text-text-accent">
                            King Jada Hotel
                        </p>
                        <p class="mt-2 text-text-secondary">Morocco Square Building, Dar es Salaam</p>

                        <div class="mt-8 space-y-4 border-t border-[var(--accent-primary)]/20 pt-6">
                            <div>
                                <h4 class="font-bold text-text-primary">Date</h4>
                                <p class="text-text-secondary">October 1st, 2025</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-text-primary">Time</h4>
                                <p class="text-text-secondary">7:00 PM - Late</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-text-primary">Dress Code</h4>
                                <p class="text-text-secondary">Red, Maroon, Black</p>
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
